import type { RichTextMediaConfig, RichTextMediaSignal } from '../richTextMedia.js';

const tagName = 'daisu-rich-media';
const css = `:host{display:block;max-width:100%;font:inherit;color:inherit}video{display:block;width:100%;height:100%;object-fit:contain;background:#000}audio{display:none}button{display:block;box-sizing:border-box;width:100%;height:24px;padding:0 12px;border:1px solid var(--cso-ui-line,#e5e6eb);border-radius:4px;font:inherit;line-height:22px;text-align:left;color:inherit;background:var(--cso-ui-rich-text-image-state-bg,var(--cso-ui-surface-muted,#f2f3f5));cursor:pointer}.error{display:block;color:var(--cso-ui-text-muted,#4e5369);font:inherit}`;
const finiteTime = (n: number) => Number.isFinite(n) && n >= 0 ? n : 0;

/** Browser-only registration. Importing this module does not read DOM globals. */
export function registerRichTextMedia() {
  if (customElements.get(tagName)) return;
  const previews: HTMLElement[] = [];
  class RichTextMediaElement extends HTMLElement {
    static observedAttributes = ['media-config'];
    private config?: RichTextMediaConfig;
    private media?: HTMLMediaElement;
    private button?: HTMLButtonElement;
    private cleanup?: AbortController;
    private version = 0;
    private source = 0;
    private wantsPlay = false;
    private failed = false;
    private pendingSeek?: number;
    private seekTimer?: ReturnType<typeof setTimeout>;
    private seekAttempts = 0;
    private rendered = '';

    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.configure(); }
    attributeChangedCallback() { if (this.isConnected) this.configure(); }
    disconnectedCallback() {
      // React may move an existing element within the same document.
      queueMicrotask(() => { if (!this.isConnected) this.dispose(); });
    }
    private url(value: unknown) {
      if (typeof value !== 'string' || !value || /[\u0000-\u0020\u007f\\]/.test(value)) return '';
      try {
        const url = new URL(value, this.ownerDocument.baseURI);
        return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
      } catch { return ''; }
    }
    private configure() {
      const raw = this.getAttribute('media-config') || '';
      if (raw === this.rendered && this.media) return;
      this.dispose();
      this.rendered = raw;
      let input: RichTextMediaConfig;
      try { input = JSON.parse(raw) as RichTextMediaConfig; } catch { return; }
      if (!input || !['audio', 'video'].includes(input.type) || !Array.isArray(input.sources)) return;
      const sources = input.sources.slice(0, 16).filter(src => !!this.url(src));
      this.config = { id: typeof input.id === 'string' ? input.id : '', type: input.type, sources,
        title: typeof input.title === 'string' ? input.title : '', poster: this.url(input.poster), loop: input.loop === true, muted: input.muted === true, preview: input.preview === true };
      const style = this.ownerDocument.createElement('style'); style.textContent = css;
      const media = this.ownerDocument.createElement(input.type);
      this.shadowRoot!.replaceChildren(style, media);
      this.media = media;
      this.failed = false; this.source = 0; this.pendingSeek = undefined;
      this.cleanup = new AbortController();
      const options = { signal: this.cleanup.signal };
      if(this.config.preview){previews.push(this);this.ownerDocument.addEventListener('keydown',event=>{if(event.key==='Escape'&&!this.ownerDocument.fullscreenElement&&previews.at(-1)===this){event.stopImmediatePropagation();this.emit('close');}},options);}
      media.preload = 'metadata'; media.loop = this.config.loop; media.muted = this.config.muted;
      if (media instanceof HTMLVideoElement) {
        media.controls = true; media.playsInline = true; media.poster = this.config.poster || '';
        media.title = this.config.title;
      } else {
        const button = this.ownerDocument.createElement('button');
        button.type = 'button'; this.button = button;
        this.shadowRoot!.append(button);
        button.addEventListener('click', () => { if (media.paused) this.playMedia(); else this.pauseMedia(); }, options);
        this.updateButton();
      }
      for (const kind of ['play', 'pause', 'ended', 'timeupdate'] as const) {
        media.addEventListener(kind, () => {
          if (!this.isConnected || this.failed) return;
          if (kind === 'play') this.wantsPlay = true;
          if (kind === 'pause' || kind === 'ended') this.wantsPlay = false;
          this.updateButton(); this.emit(kind);
        }, options);
      }
      for (const event of ['loadedmetadata', 'loadeddata', 'durationchange', 'canplay', 'progress']) {
        media.addEventListener(event, () => { this.applySeek(); this.emit('timeupdate'); }, options);
      }
      media.addEventListener('seeked', () => {
        if (this.pendingSeek !== undefined && Math.abs(media.currentTime - this.seekTarget()) <= 0.1) this.finishSeek();
        else this.applySeek();
        this.emit('timeupdate');
      }, options);
      media.addEventListener('error', () => {
        if (!this.isConnected || this.failed) return;
        if (this.source + 1 < this.config!.sources.length) {
          const resume = this.wantsPlay; this.source++;
          this.setSource();
          if (resume) this.playMedia();
        } else this.fail(media.error?.message || '音视频资源加载失败', true);
      }, options);
      const pause = () => { this.pauseMedia(); };
      this.ownerDocument.addEventListener('visibilitychange', () => { if (this.ownerDocument.hidden) pause(); }, options);
      this.ownerDocument.defaultView?.addEventListener('pagehide', pause, options);
      if (!sources.length) this.fail('没有可播放的音视频地址', true);
      else this.setSource();
    }
    private updateButton() {
      if (!this.button || !this.media || !this.config) return;
      this.button.textContent = `${this.media.paused ? '▶' : 'Ⅱ'} ${this.config.title || '播放音频'}`;
      this.button.setAttribute('aria-pressed', String(!this.media.paused));
    }
    private emit(kind: RichTextMediaSignal['kind'], extra: Partial<RichTextMediaSignal> = {}) {
      if (!this.config || !this.isConnected || (kind === 'timeupdate' && this.media?.seeking)) return;
      const detail: RichTextMediaSignal = { kind, id: this.config.id, type: this.config.type,
        src: this.config.sources[this.source] || '', currentTime: finiteTime(this.media?.currentTime || 0),
        duration: finiteTime(this.media?.duration || 0), ...extra };
      this.dispatchEvent(new CustomEvent('mediaevent', { detail, bubbles: true, composed: true }));
    }
    private fail(message: string, fatal: boolean, code?: string) {
      if (fatal) {
        this.finishSeek();
        this.failed = true; this.wantsPlay = false; this.media?.pause();
        const error = this.ownerDocument.createElement('span');
        error.className = 'error'; error.textContent = `${this.config?.title || '音视频'} ×`;
        error.setAttribute('role', 'status');
        const style = this.shadowRoot!.querySelector('style')!;
        this.shadowRoot!.replaceChildren(style, error);
      }
      this.emit('error', { message, fatal, code });
    }
    private setSource() {
      if (!this.media || !this.config) return;
      this.media.src = this.url(this.config.sources[this.source]);
      this.media.load();
    }
    /** UI methods return whether the instruction was accepted, not playback success. */
    playMedia() {
      if (!this.media || !this.isConnected || this.failed) return false;
      const media = this.media, version = this.version;
      this.wantsPlay = true;
      try {
        void media.play().then(() => {
          if (version !== this.version || !this.isConnected || !this.wantsPlay) media.pause();
        }).catch((reason: unknown) => {
          if (version !== this.version || !this.isConnected || !this.wantsPlay) return;
          const error = reason as Error;
          if (error.name === 'AbortError') return;
          this.wantsPlay = false;
          // Autoplay restrictions can be retried by tapping the native player.
          this.fail(error.message || '无法播放音视频', false, 'PLAY_REJECTED');
        });
      } catch (error) { this.wantsPlay = false; this.fail(String(error), false); }
      return true;
    }
    pauseMedia() {
      if (!this.media || !this.isConnected || this.failed) return false;
      this.wantsPlay = false; this.media.pause(); return true;
    }
    seekMedia({ seconds }: { seconds: number }) {
      if (!this.media || !this.isConnected || this.failed || !Number.isFinite(seconds) || seconds < 0) return false;
      this.finishSeek(); this.pendingSeek = seconds; this.seekAttempts = 0;
      // Some engines accept currentTime before they can actually seek. Keep the
      // request until seeked confirms it, and retry as metadata/buffers arrive.
      this.seekTimer = setTimeout(() => {
        this.finishSeek();
        if (this.isConnected) this.fail('当前资源暂时无法跳转至目标位置，请稍后重试。', false, 'SEEK_FAILED');
      }, 10000);
      this.applySeek();
      if(this.pendingSeek === undefined) this.emit('timeupdate');
      return true;
    }
    private seekTarget() {
      const seconds = this.pendingSeek || 0, duration = this.media?.duration;
      return duration !== undefined && Number.isFinite(duration) ? Math.min(seconds, duration) : seconds;
    }
    private applySeek() {
      const media = this.media;
      if (this.pendingSeek === undefined || !media || !media.readyState || media.seeking || this.failed) return;
      const target = this.seekTarget();
      if (Math.abs(media.currentTime - target) <= 0.1) { this.finishSeek(); return; }
      if (++this.seekAttempts > 8) return;
      try { media.currentTime = target; } catch { /* retry when metadata/buffers advance */ }
    }
    private finishSeek() {
      if (this.seekTimer !== undefined) clearTimeout(this.seekTimer);
      this.seekTimer = undefined; this.pendingSeek = undefined;
    }
    private dispose() {
      const index=previews.indexOf(this);if(index>=0)previews.splice(index,1);
      this.version++; this.wantsPlay = false;
      this.cleanup?.abort(); this.cleanup = undefined;
      if (this.media) { this.media.pause(); this.media.removeAttribute('src'); this.media.load(); }
      this.media = undefined; this.button = undefined; this.config = undefined;
      this.rendered = ''; this.finishSeek();
    }
  }
  customElements.define(tagName, RichTextMediaElement);
}

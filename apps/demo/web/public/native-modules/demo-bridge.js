export default function createDemoBridge(_modules, call) {
  return { postMessage(payload) { return call('postMessage', payload); } };
}

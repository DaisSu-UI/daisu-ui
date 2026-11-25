import { expect,test } from '@rstest/core';
import { cropperAspect,cropperExportSize,cropperFrame,cropperGeometry,initialCropperTransform } from './imgCropperModel.js';
test('cropper locks every crop corner inside rotated image bounds under extreme drags and zooms',()=>{
 for(const rotation of [0,30,45,90,137,180,270])for(const zoom of [0.1,1,2,99]){
  const source={width:1200,height:750},frame={width:350,height:210};
  const g=cropperGeometry(source,frame,{rotation,zoom,offsetX:99999,offsetY:-99999},3),angle=g.rotation*Math.PI/180;
  expect(g.zoom).toBeGreaterThanOrEqual(1);expect(g.zoom).toBeLessThanOrEqual(3);
  for(const x of [-frame.width/2,frame.width/2])for(const y of [-frame.height/2,frame.height/2]){
   const u=(Math.cos(angle)*(x-g.offsetX)+Math.sin(angle)*(y-g.offsetY))/g.scale;
   const v=(-Math.sin(angle)*(x-g.offsetX)+Math.cos(angle)*(y-g.offsetY))/g.scale;
   expect(Math.abs(u)).toBeLessThanOrEqual(source.width/2+1e-8);expect(Math.abs(v)).toBeLessThanOrEqual(source.height/2+1e-8);
  }
 }
});
test('cropper matches reference frame dimensions and enforces meaningful output limits',()=>{
 expect(cropperFrame({width:390,height:800},'1:1')).toEqual({width:350,height:350});
 expect(cropperExportSize(cropperFrame({width:390,height:800},'1:1'),2)).toEqual({width:700,height:700});
 expect(cropperExportSize(cropperFrame({width:390,height:800},'3:2'),2)).toEqual({width:700,height:467});
 expect(()=>cropperAspect('0:1')).toThrow();expect(()=>cropperExportSize({width:9000,height:9000},2)).toThrow();
 const g=cropperGeometry({width:200,height:100},{width:350,height:350},{...initialCropperTransform,rotation:90});expect(g.offsetY).toBe(0);expect(g.scale).toBeCloseTo(3.5);
});

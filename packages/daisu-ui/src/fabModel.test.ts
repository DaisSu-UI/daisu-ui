import { describe, expect, it } from '@rstest/core';
import { clampFab, fabBounds, fabPosition, snapFab } from './fabModel.js';

describe('Fab viewport placement and dragging', () => {
  const bounds = fabBounds(390, 844, 60, 60, { top: 60 });
  it('places all eight anchors inside viewport gaps', () => {
    expect(fabPosition('left-top', bounds)).toEqual({x:16,y:60});
    expect(fabPosition('right-top', bounds)).toEqual({x:314,y:60});
    expect(fabPosition('left-bottom', bounds)).toEqual({x:16,y:768});
    expect(fabPosition('right-bottom', bounds)).toEqual({x:314,y:768});
    expect(fabPosition('left-center', bounds)).toEqual({x:16,y:414});
    expect(fabPosition('right-center', bounds)).toEqual({x:314,y:414});
    expect(fabPosition('top-center', bounds)).toEqual({x:165,y:60});
    expect(fabPosition('bottom-center', bounds)).toEqual({x:165,y:768});
  });
  it('clamps drags and snaps to the nearest edge with an inward menu', () => {
    expect(clampFab({x:-100,y:1000},bounds)).toEqual({x:16,y:768});
    expect(snapFab({x:100,y:300},bounds)).toEqual({x:16,y:300,direction:'right'});
    expect(snapFab({x:290,y:-20},bounds)).toEqual({x:314,y:60,direction:'left'});
  });
  it('keeps bounds valid for a viewport smaller than the trigger and invalid gaps', () => {
    const small = fabBounds(40,30,60,60,{left:NaN,right:-100});
    expect(small).toEqual({minX:0,minY:0,maxX:0,maxY:0});
  });
});

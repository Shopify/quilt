import {random} from 'faker';
import {AssetTiming} from '../../types';
import {AsyncAssetManager} from '../assets';

describe('AsyncAssetManager', () => {
  it('returns async assets', () => {
    const asyncAssets = new AsyncAssetManager();
    const id = random.uuid();

    asyncAssets.markAsUsed(id);

    expect(asyncAssets.used()).toStrictEqual([
      {id, scripts: true, styles: true},
    ]);
  });

  it('de-duplicates assets that are marked as used multiple times', () => {
    const asyncAssets = new AsyncAssetManager();
    const id = random.uuid();

    asyncAssets.markAsUsed(id);
    asyncAssets.markAsUsed(id);

    expect(asyncAssets.used()).toHaveLength(1);
  });

  it('only returns assets with the specified timing', () => {
    const asyncAssets = new AsyncAssetManager();
    const currentPageId = random.uuid();
    const nextPageId = random.uuid();

    asyncAssets.markAsUsed(currentPageId, AssetTiming.CurrentPage);
    asyncAssets.markAsUsed(nextPageId, AssetTiming.NextPage);

    expect(asyncAssets.used(AssetTiming.Immediate)).toHaveLength(0);
    expect(asyncAssets.used(AssetTiming.CurrentPage)).toStrictEqual([
      {id: currentPageId, scripts: true, styles: true},
    ]);
    expect(asyncAssets.used(AssetTiming.NextPage)).toStrictEqual([
      {id: nextPageId, scripts: true, styles: true},
    ]);
  });

  it('returns assets from multiple timings', () => {
    const asyncAssets = new AsyncAssetManager();
    const currentPageId = random.uuid();
    const nextPageId = random.uuid();

    asyncAssets.markAsUsed(currentPageId, AssetTiming.CurrentPage);
    asyncAssets.markAsUsed(nextPageId, AssetTiming.NextPage);

    expect(
      asyncAssets.used([AssetTiming.CurrentPage, AssetTiming.NextPage]),
    ).toStrictEqual([
      {id: currentPageId, styles: true, scripts: true},
      {id: nextPageId, styles: true, scripts: true},
    ]);
  });

  it('stores information about whether to include the styles and scripts individually', () => {
    const asyncAssets = new AsyncAssetManager();
    const idOne = random.uuid();
    const idTwo = random.uuid();

    asyncAssets.markAsUsed(idOne, {styles: AssetTiming.NextPage});
    asyncAssets.markAsUsed(idTwo, {scripts: AssetTiming.NextPage});

    expect(asyncAssets.used()).toStrictEqual([
      {id: idOne, scripts: true, styles: false},
      {id: idTwo, scripts: false, styles: true},
    ]);

    expect(asyncAssets.used(AssetTiming.NextPage)).toStrictEqual([
      {id: idOne, scripts: false, styles: true},
      {id: idTwo, scripts: true, styles: false},
    ]);
  });

  it('includes styles if one use of an ID uses them, but another does not', () => {
    const asyncAssets = new AsyncAssetManager();
    const id = random.uuid();

    asyncAssets.markAsUsed(id, {styles: AssetTiming.NextPage});
    asyncAssets.markAsUsed(id);

    expect(asyncAssets.used()).toStrictEqual([
      {id, scripts: true, styles: true},
    ]);

    expect(asyncAssets.used(AssetTiming.NextPage)).toHaveLength(0);
  });

  it('only stores the earliest asset timing for a given asset', () => {
    const asyncAssets = new AsyncAssetManager();
    const id = random.uuid();

    asyncAssets.markAsUsed(id, AssetTiming.NextPage);
    asyncAssets.markAsUsed(id, AssetTiming.CurrentPage);

    expect(asyncAssets.used(AssetTiming.NextPage)).toHaveLength(0);
    expect(asyncAssets.used(AssetTiming.CurrentPage)).toStrictEqual([
      {id, scripts: true, styles: true},
    ]);

    asyncAssets.markAsUsed(id, AssetTiming.Immediate);
    asyncAssets.markAsUsed(id, AssetTiming.CurrentPage);

    expect(asyncAssets.used(AssetTiming.CurrentPage)).toHaveLength(0);
    expect(asyncAssets.used(AssetTiming.Immediate)).toStrictEqual([
      {id, scripts: true, styles: true},
    ]);
  });

  it('clears all assets between each pass in an effect', () => {
    const asyncAssets = new AsyncAssetManager();
    const id = random.uuid();

    asyncAssets.markAsUsed(id);
    asyncAssets.effect.betweenEachPass!({
      finished: false,
      index: 0,
      renderDuration: 0,
      resolveDuration: 0,
    });

    expect(asyncAssets.used()).toHaveLength(0);
  });
});

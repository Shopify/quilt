import { AssetMetadata, Entrypoint } from 'webpack-asset-metadata-plugin';
interface HangTightManifest extends AssetMetadata {
    development: {
        hangTight: Entrypoint;
    };
}
declare const hangTightManifest: HangTightManifest;
export default hangTightManifest;

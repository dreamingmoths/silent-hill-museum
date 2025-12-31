import {
  DataTexture,
  LinearFilter,
  MeshStandardMaterial,
  BufferGeometry,
  Vector4,
  Float32BufferAttribute,
  Uint16BufferAttribute,
  GLSL3,
  RawShaderMaterial,
  RedIntegerFormat,
  UnsignedIntType,
  Vector2,
  Vector3,
  Int32BufferAttribute,
  ClampToEdgeWrapping,
  NearestFilter,
  RGBAFormat,
  UnsignedByteType,
  Material,
  Uniform,
  Matrix3,
} from "three";
import { clientState } from "../objects/MuseumState";
import { transformationMatrixToMat4 } from "../utils";
import SilentHill3Model from "../kaitai/Sh3mdl";
import ps2_frag from "../glsl/ps2_frag.glsl?raw";
import ps2_vert from "../glsl/ps2_vert.glsl?raw";
import { ceilPowerOfTwo } from "three/src/math/MathUtils.js";
import { fpsmt8, fpsmt4, fetchSwizzles } from "../gs/experimental";
import { psmct32, psmt4, psmt8 } from "../gs/lib";
import { TextureOptions } from "../objects/TextureViewer";

type Sh3GeometryOptions = {
  maxEquipmentId: number;
};
export const createSh3Geometry = (
  model: SilentHill3Model,
  options?: Partial<Sh3GeometryOptions>
) => {
  const { maxEquipmentId = 4 } = options ?? {};
  const verts = [];
  const norms = [];
  const uv = [];
  const triangles = [];
  const skinIndices: number[] = [];
  const skinWeights: number[] = [];
  const texInfo = [];

  const geometry = new BufferGeometry();
  const matrices = model.modelHeader.initialMatrices.map((m) =>
    transformationMatrixToMat4(m)
  );
  const normalMatrices = matrices.map((m) => new Matrix3().getNormalMatrix(m));
  const parts = model.modelHeader.opaqueParts.concat(
    model.modelHeader.transparentParts
  );
  const opaquePartCount = model.modelHeader.opaqueParts.length;
  let triangleReversed = true;

  let vertexCount = 0;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const vifData = part.vifData;
    const attrs = vifData.attributes;
    let base = verts.length / 3;
    const isTransparent = i >= opaquePartCount;

    const pair =
      model.modelHeader.textureBlocks.texturePairs[part.textureIndex];
    const imageIndex = pair.imageIndex;
    const paletteIndex = pair.paletteIndex;

    let groupIndex = 0;
    for (const attr of attrs) {
      const vertices = attr.vertices;
      const normals = attr.normals;
      const uvs = attr.uvs;
      const localBoneAddr = attr.group.localBoneAddr;
      const weights = attr.weights?.map((w) => w / 0x1000);

      const localBoneIndices = localBoneAddr.map(
        (addr) => (addr - vifData.ofsBoneMatrixBase) >> 2
      );
      const parentBone = part.bones[localBoneIndices[0]];

      const boneIndices = [parentBone];
      const boneInfluenceCount = attr.group.numBonePairs / 2 + 1;
      for (let k = 1; k < boneInfluenceCount; k++) {
        const index = part.bonePairs[localBoneIndices[k] - part.bones.length];
        boneIndices[k] = model.modelHeader.bonePairs[index].child;
      }
      while (boneIndices.length < 4) {
        boneIndices.push(0);
      }

      vertexCount += vifData.groups[groupIndex++].numVertices;
      for (
        let v = 0, uvIndex = 0, weightIndex = 0;
        v < vertices.length;
        v += 3, uvIndex += 2, weightIndex += boneInfluenceCount
      ) {
        const vect = new Vector4(
          vertices[v + 0] / 0x10,
          vertices[v + 1] / 0x10,
          vertices[v + 2] / 0x10,
          1.0
        );
        vect.applyMatrix4(matrices[parentBone]);
        verts.push(vect.x, vect.y, vect.z);

        const normal = new Vector3(
          normals[v + 0] / -0x1000,
          normals[v + 1] / -0x1000,
          normals[v + 2] / -0x1000
        );
        normal.applyNormalMatrix(normalMatrices[parentBone]);
        norms.push(normal.x, normal.y, normal.z);

        texInfo.push(imageIndex, paletteIndex, isTransparent ? 1 : 0);
        uv.push(uvs[uvIndex] / 0x1000, uvs[uvIndex + 1] / 0x1000);
        skinIndices.push(...boneIndices);

        if (!weights) {
          skinWeights.push(1, 0, 0, 0);
          continue;
        }
        let sum = 0;
        for (let k = 0; k < boneInfluenceCount; k++) {
          sum += weights[weightIndex + k];
        }
        for (let k = 0; k < boneInfluenceCount; k++) {
          skinWeights.push(weights[weightIndex + k] / sum);
        }
        for (let k = boneInfluenceCount; k < 4; k++) {
          skinWeights.push(0);
        }
      }
    }

    if (part.equipmentId > maxEquipmentId) {
      // don't show extra hands, etc.
      continue;
    }

    const triStrip = vifData.triangles;
    const v = (cmd: number) => {
      return base + (((cmd & 0x7fff) - vifData.ofsVertexBase) >> 2);
    };

    const start = triangles.length;
    let count = 0;

    for (let i = 0; i < triStrip.length; i++) {
      const cmd = triStrip[i];

      if (i > 1 && (cmd & 0x8000) === 0) {
        const cmd1 = triStrip[i - 1];
        const cmd2 = triStrip[i - 2];

        const t1 = v(cmd);
        const t2 = v(cmd1);
        const t3 = v(cmd2);
        if (t1 !== t2 && t2 !== t3 && t1 !== t3) {
          if (triangleReversed) {
            triangles.push(t3, t2, t1);
          } else {
            triangles.push(t1, t2, t3);
          }
          count += 3;
        }
      }

      triangleReversed = !triangleReversed;
    }

    geometry.addGroup(start, count, part.textureIndex);
  }

  const vertexBuffer = new Float32Array(verts);
  const vLength = vertexBuffer.length;

  const positionAttribute = new Float32BufferAttribute(vertexBuffer, 3);
  geometry.setAttribute("position", positionAttribute);
  geometry.setAttribute(
    "normal",
    new Float32BufferAttribute(new Float32Array(norms), 3)
  );
  geometry.setAttribute(
    "uv",
    new Float32BufferAttribute(new Float32Array(uv), 2)
  );
  geometry.setAttribute("texInfo", new Int32BufferAttribute(texInfo, 3));
  geometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeights, 4)
  );
  geometry.setIndex(triangles);

  return { geometry, vLength, vCount: vertexCount, parts };
};

type Sh3MaterialOptions = {
  device: "cpu" | "gpu";
  silly: boolean;
};

export const createSh3Material = (
  model: SilentHill3Model,
  swizzles: Swizzles,
  options?: Partial<Sh3MaterialOptions>
) => {
  const { device = "cpu", silly = true } = options ?? {};
  let materials: RawShaderMaterial | Material[] = [];
  const images = [];
  let textureViewerArgs: TextureOptions[] = [];

  if (device === "cpu") {
    textureViewerArgs = [];
    const imageMap = new Map<number, Uint8Array>();
    for (let i = 0; i < model.modelHeader.numTextureInfo; i++) {
      const pair = model.modelHeader.textureBlocks.texturePairs[i];
      const imageIndex = pair.imageIndex;
      const paletteIndex = pair.paletteIndex;

      // We assume that each texture pair is associated to either an opaque or a
      // transparent part, and not both. There are two exceptions to this
      // assumption: `it/it_ctear.mdl` (which is so small that it's difficult to
      // notice) and `test_chdcc2.mdl` (which is messed up in other ways).
      const transparent =
        model.modelHeader.transparentParts.findIndex(
          (part) => part.textureIndex === i
        ) >= 0;
      const tex = model.textureHeader.textures[imageIndex];

      if (silly) {
        const { dataTextureArgs, material } = renderPalettedImageSilly(
          tex,
          paletteIndex,
          swizzles
        );
        textureViewerArgs.push(...dataTextureArgs);

        material.transparent = transparent;
        materials[i] = material;
      } else {
        let psmct32Data = imageMap.get(imageIndex);
        if (!psmct32Data) {
          psmct32Data = psmct32(
            tex.imageData.slice(),
            tex.rrw,
            tex.rrh,
            tex.dbw
          );
          imageMap.set(imageIndex, psmct32Data);
        }
        const { dataTextureArgs, material } = renderPalettedImage(
          tex,
          paletteIndex,
          psmct32Data
        );
        textureViewerArgs.push(...dataTextureArgs);

        material.transparent = transparent;
        materials[i] = material;
      }
    }
  } else {
    const textures = model.textureHeader.textures;
    const { dataTextureArgs, material } = ps2Shader(textures, swizzles);
    textureViewerArgs = dataTextureArgs;
    materials = material;
  }

  let textureViewer;
  if ((textureViewer = clientState.getTextureViewer())) {
    for (const args of textureViewerArgs) {
      images.push(textureViewer.createFromUint8Array(...args));
    }
  }

  return { materials, images };
};

export const createSwizzleTextures = async (url?: string) => {
  const [swizzle4, swizzle8] = await fetchSwizzles(url);

  const psmt8Texture = new DataTexture(
    new Uint32Array(swizzle8),
    128,
    64,
    RedIntegerFormat,
    UnsignedIntType
  );
  psmt8Texture.minFilter = NearestFilter;
  psmt8Texture.magFilter = NearestFilter;
  psmt8Texture.wrapS = ClampToEdgeWrapping;
  psmt8Texture.wrapT = ClampToEdgeWrapping;
  psmt8Texture.generateMipmaps = false;
  psmt8Texture.needsUpdate = true;

  const psmt4Texture = new DataTexture(
    new Uint32Array(swizzle4),
    128,
    128,
    RedIntegerFormat,
    UnsignedIntType
  );
  psmt4Texture.minFilter = NearestFilter;
  psmt4Texture.magFilter = NearestFilter;
  psmt4Texture.wrapS = ClampToEdgeWrapping;
  psmt4Texture.wrapT = ClampToEdgeWrapping;
  psmt4Texture.generateMipmaps = false;
  psmt4Texture.needsUpdate = true;

  return { swizzle4, swizzle8, psmt8Texture, psmt4Texture };
};
export type Swizzles = Awaited<ReturnType<typeof createSwizzleTextures>>;

const materialCache = new Map<number, RawShaderMaterial>();
const ps2Shader = (
  textures: SilentHill3Model.Texture[],
  swizzles: Swizzles
) => {
  const imageDataTextures = [];
  const imgSizes = [];
  const clutInfos = [];
  const imageInfos: TextureOptions[] = [];
  const psm = [];

  const clutArrays = [];
  const clutSizes = [];
  const clutOffsets = [];

  let clutAtlasWidth = 0x40;
  let clutAtlasHeight = 0;

  for (let i = 0; i < textures.length; i++) {
    const texture = textures[i];

    const clut = texture.clut;
    if (!clut) {
      throw new Error("Missing color lookup table!");
    }
    const clutData = clut.clutData;
    const clutWidth = clut.width;
    const clutHeight = Math.floor(clut.dataSize / (clut.width << 2));
    const clutInfo = [
      clutData,
      clutWidth,
      clutHeight,
      { interpolation: "nearest" },
    ];
    const clutArray = psmct32(clutData.slice(), clutWidth, clutHeight, 1);
    clutAtlasWidth = Math.max(clutAtlasWidth, clutWidth);
    clutArrays.push(clutArray);
    clutOffsets.push(clutAtlasHeight);
    clutAtlasHeight += 0x40;

    const image = texture.imageData;
    const imageWidth = texture.width;
    const imageHeight = texture.height;
    const imageInfo: TextureOptions = [
      image,
      texture.rrw,
      texture.rrh,
      { interpolation: "nearest" },
    ];
    const imageDataTexture = new DataTexture(
      new Uint32Array(image),
      texture.width / (texture.psm === 20 ? 2 : 1),
      texture.height,
      RedIntegerFormat,
      UnsignedIntType
    );
    imageDataTexture.minFilter = NearestFilter;
    imageDataTexture.magFilter = NearestFilter;
    imageDataTexture.wrapS = ClampToEdgeWrapping;
    imageDataTexture.wrapT = ClampToEdgeWrapping;
    imageDataTexture.needsUpdate = true;

    imageDataTextures.push(imageDataTexture);
    imgSizes.push(new Vector2(imageWidth, imageHeight));
    clutSizes.push(new Vector2(clutWidth, clutHeight));
    imageInfos.push(imageInfo);
    clutInfos.push(clutInfo);
    psm.push(texture.psm);
  }

  // pack together all the color lookup tables
  clutAtlasHeight = ceilPowerOfTwo(clutAtlasHeight);
  const clutAtlas = new Uint8Array(clutAtlasWidth * clutAtlasHeight * 4);
  let index = 0;
  for (let i = 0; i < clutArrays.length; i++) {
    const array = clutArrays[i];
    for (let j = 0; j < array.length; j++) {
      clutAtlas[index + j] = array[j];
    }
    index += 64 * 64 * 4;
  }
  const clutDataTexture = new DataTexture(
    clutAtlas,
    clutAtlasWidth,
    clutAtlasHeight,
    RGBAFormat,
    UnsignedByteType
  );
  clutDataTexture.minFilter = NearestFilter;
  clutDataTexture.magFilter = NearestFilter;
  clutDataTexture.wrapS = ClampToEdgeWrapping;
  clutDataTexture.wrapT = ClampToEdgeWrapping;
  clutDataTexture.generateMipmaps = false;
  clutDataTexture.needsUpdate = true;

  const { psmt4Texture, psmt8Texture } = swizzles;
  const uniforms = {
    clutTexture: new Uniform(clutDataTexture),
    imgTexture: new Uniform(imageDataTextures),
    swizzleTexture8: new Uniform(psmt8Texture),
    swizzleTexture4: new Uniform(psmt4Texture),

    imgSize: new Uniform(imgSizes),
    clutSize: new Uniform(clutSizes),
    clutOffsets: new Uniform(clutOffsets),
    psm: new Uniform(psm),

    ambientLightColor: new Uniform(new Vector3(1, 1, 1)),
    opacity: new Uniform(1),
    alphaTest: new Uniform(0.01),
    uTime: new Uniform(0),
    lightingMode: new Uniform(null),
    transparent: new Uniform(1),
  };

  const textureCount = textures.length;
  const header = `#define TEXTURE_COUNT ${textureCount}\n`;

  let material = materialCache.get(textureCount);
  if (!material) {
    material = new RawShaderMaterial({
      vertexShader: ps2_vert,
      fragmentShader: header + ps2_frag,
      uniforms,
      glslVersion: GLSL3,
      transparent: true,
    });
    material.name = "ps2-shader";
    materialCache.set(textureCount, material);
  } else {
    for (const key in uniforms) {
      const k = key as keyof typeof uniforms;
      material.uniforms[k].value = uniforms[k].value;
    }
  }
  material.needsUpdate = true;

  const atlasInfo: TextureOptions = [
    clutAtlas,
    clutAtlasWidth,
    clutAtlasHeight,
    { interpolation: "nearest" },
  ];
  const dataTextureArgs: TextureOptions[] = [atlasInfo, ...imageInfos];

  return {
    material,
    dataTextureArgs,
  };
};

const renderPalettedImageSilly = (
  texture: SilentHill3Model.Texture,
  paletteIndex: number,
  swizzles: Swizzles
) => {
  const imageData = texture.imageData.slice();

  if (!texture.clut) {
    throw new Error("Missing color lookup table!");
  }

  const clutHeight = Math.floor(
    texture.clut.dataSize / (texture.clut.width << 2)
  );
  const clut = psmct32(
    texture.clut.clutData.slice(),
    texture.clut.width,
    clutHeight,
    1
  );

  let image;
  if (texture.psm < 20) {
    image = fpsmt8(
      swizzles.swizzle8,
      imageData,
      clut,
      texture.width,
      texture.height,
      paletteIndex
    );
  } else {
    image = fpsmt4(
      swizzles.swizzle4,
      imageData,
      clut,
      texture.width,
      texture.height,
      paletteIndex
    );
  }

  const args = [image, texture.width, texture.height] as const;
  const dataTexture = new DataTexture(...args);
  dataTexture.needsUpdate = true;
  dataTexture.minFilter = LinearFilter;
  dataTexture.magFilter = LinearFilter;

  const material = new MeshStandardMaterial({
    map: dataTexture,
    alphaTest: 0.01,
    transparent: true,
  });
  const dataTextureArgs: TextureOptions[] = [
    [image, texture.width, texture.height, { interpolation: "linear" }],
  ];

  return {
    material,
    image,
    dataTextureArgs,
    dataTexture,
  };
};

const renderPalettedImage = (
  texture: SilentHill3Model.Texture,
  paletteIndex: number,
  psmct32Data: Uint8Array
) => {
  if (!texture.clut) {
    throw new Error("Missing color lookup table!");
  }

  const clutHeight = Math.floor(
    texture.clut.dataSize / (texture.clut.width << 2)
  );
  const clut = psmct32(
    texture.clut.clutData.slice(),
    texture.clut.width,
    clutHeight,
    1
  );

  let image;
  if (texture.psm < 20) {
    image = psmt8(
      psmct32Data,
      clut,
      texture.width,
      texture.height,
      paletteIndex
    );
  } else {
    image = psmt4(
      psmct32Data,
      clut,
      texture.width,
      texture.height,
      paletteIndex
    );
  }

  const args = [image, texture.width, texture.height] as const;
  const dataTexture = new DataTexture(...args);
  dataTexture.needsUpdate = true;
  dataTexture.minFilter = LinearFilter;
  dataTexture.magFilter = LinearFilter;

  const material = new MeshStandardMaterial({
    map: dataTexture,
    alphaTest: 0.01,
    transparent: false,
  });

  const dataTextureArgs: TextureOptions[] = [
    [image, texture.width, texture.height, { interpolation: "linear" }],
  ];
  return {
    material,
    image,
    dataTextureArgs,
    dataTexture,
  };
};

export const favoriteSh3ModelFiles = [
  "pl/chhaa.mdl", // classic heather model
  "item/chhdd.mdl", // princess heart heather
  "wp/wp_lig.mdl", // purple leopard print light saber
  "bg/bg_den.mdl", // very cool train
  "bg/bg_jet.mdl", // roller coaster cart
  "ch/chcaa.mdl", // claudia model
];
export const sh3ModelFiles = [
  "bg/bg_bld.mdl",
  "bg/bg_car.mdl",
  "bg/bg_cpw.mdl",
  "bg/bg_ddd.mdl",
  "bg/bg_ded1.mdl",
  "bg/bg_den.mdl",
  "bg/bg_dor.mdl",
  "bg/bg_fre.mdl",
  "bg/bg_hry.mdl",
  "bg/bg_hum.mdl",
  "bg/bg_huo.mdl",
  "bg/bg_isu.mdl",
  "bg/bg_jet.mdl",
  "bg/bg_lyc.mdl",
  "bg/bg_mes.mdl",
  "bg/bg_mes_.mdl",
  "bg/bg_rod.mdl",
  "bg/bg_slv.mdl",
  "bg/bg_slv_.mdl",
  "bg/bg_spi.mdl",
  "bg/bg_sya.mdl",
  "bg/bg_tka.mdl",
  "bg/bg_tra.mdl",
  "bg/bg_wg1.mdl",
  "bg/bg_wg2.mdl",
  "bg/bg_wg3.mdl",
  "bg/bg_wg4.mdl",
  "bg/bg_wg5.mdl",
  "bg/bg_wmn.mdl",
  "bg/en_zbb.mdl",
  "ch/chcaa.mdl",
  "ch/chdaa.mdl",
  "ch/chdbb.mdl",
  // "ch/chdcc.mdl",
  // "ch/chddd.mdl",
  "ch/chdee.mdl",
  "ch/chdff.mdl",
  "ch/chdgg.mdl",
  // "ch/chdhh.mdl",
  // "ch/chdii.mdl",
  "ch/chdjj.mdl",
  "ch/chvaa.mdl",
  "en/en_aid.mdl",
  "en/en_ap2.mdl",
  "en/en_apb.mdl",
  "en/en_bhr.mdl",
  "en/en_ckn.mdl",
  "en/en_deb.mdl",
  "en/en_ded1.mdl",
  "en/en_fly.mdl",
  "en/en_hpb.mdl",
  "en/en_lie.mdl",
  "en/en_lix.mdl",
  "en/en_mry.mdl",
  "en/en_nse.mdl",
  "en/en_one.mdl",
  "en/en_rod.mdl",
  "en/en_shb.mdl",
  "en/en_smb.mdl",
  "en/en_spi.mdl",
  "it/anime_test.mdl",
  "it/hige_lip.mdl",
  "it/it_bbook.mdl",
  "it/it_bld2.mdl",
  "it/it_camera.mdl",
  "it/it_can.mdl",
  "it/it_chain.mdl",
  "it/it_cl2.mdl",
  "it/it_clw.mdl",
  "it/it_ctear.mdl",
  "it/it_dagger.mdl",
  "it/it_dagger2.mdl",
  "it/it_driver.mdl",
  "it/it_dry.mdl",
  "it/it_hanger.mdl",
  "it/it_hgun.mdl",
  "it/it_hgun2.mdl",
  "it/it_jacki.mdl",
  "it/it_jerky.mdl",
  "it/it_juwaki.mdl",
  "it/it_juwaki2.mdl",
  "it/it_juwaki4.mdl",
  "it/it_juwaki5.mdl",
  "it/it_knife.mdl",
  "it/it_knife2.mdl",
  "it/it_lifekey.mdl",
  "it/it_liv.mdl",
  "it/it_map.mdl",
  "it/it_mc2.mdl",
  "it/it_mch.mdl",
  "it/it_meatlump.mdl",
  "it/it_mkey.mdl",
  "it/it_necklace.mdl",
  "it/it_necklace2.mdl",
  "it/it_note.mdl",
  "it/it_oxi.mdl",
  "it/it_photo.mdl",
  "it/it_radio2.mdl",
  "it/it_tablet.mdl",
  "it/it_tear.mdl",
  "it/it_tog.mdl",
  "it/it_trs.mdl",
  "item/anime_test.mdl",
  "item/bg_bld.mdl",
  "item/bg_car.mdl",
  "item/bg_cpw.mdl",
  "item/bg_ddd.mdl",
  // "item/bg_ddd_kage.mdl",
  "item/bg_ded1.mdl",
  "item/bg_ded2.mdl",
  "item/bg_ded3.mdl",
  "item/bg_den.mdl",
  "item/bg_dor.mdl",
  "item/bg_fel.mdl",
  "item/bg_fre.mdl",
  "item/bg_hry.mdl",
  "item/bg_hum.mdl",
  "item/bg_huo.mdl",
  "item/bg_isu.mdl",
  "item/bg_jet.mdl",
  "item/bg_lyc.mdl",
  "item/bg_mes.mdl",
  "item/bg_rod.mdl",
  "item/bg_slv.mdl",
  "item/bg_spi.mdl",
  "item/bg_sya.mdl",
  "item/bg_tes.mdl",
  "item/bg_tes_2.mdl",
  "item/bg_tka.mdl",
  // "item/bg_tka_kage.mdl",
  "item/bg_tra.mdl",
  "item/bg_traxx.mdl",
  "item/bg_wg1.mdl",
  "item/bg_wg2.mdl",
  "item/bg_wg3.mdl",
  "item/bg_wg4.mdl",
  "item/bg_wg5.mdl",
  "item/bg_wmn.mdl",
  "item/chcaa.mdl",
  "item/chcaa_cno.mdl",
  // "item/chcaa_kage.mdl",
  "item/chcbb.mdl",
  "item/chdaa.mdl",
  // "item/chdaa_kage.mdl",
  "item/chdaa_lip.mdl",
  "item/chdaa_test.mdl",
  "item/chdbb.mdl",
  // "item/chdbb_kage.mdl",
  "item/chdcc.mdl",
  "item/chddd.mdl",
  "item/chdee.mdl",
  "item/chdff.mdl",
  "item/chdgg.mdl",
  "item/chdhh.mdl",
  "item/chdii.mdl",
  "item/chdjj.mdl",
  "item/chfuda.mdl",
  "item/chhaa.mdl",
  "item/chhaa_bak.mdl",
  "item/chhaa_cl.mdl",
  // "item/chhaa_kage.mdl",
  "item/chhaa_wg.mdl",
  "item/chhbb.mdl",
  "item/chhcc.mdl",
  "item/chhdd.mdl",
  "item/chhee.mdl",
  "item/chhff.mdl",
  "item/chhgg.mdl",
  "item/chhhh.mdl",
  "item/chhii.mdl",
  "item/chhjj.mdl",
  "item/chhkk.mdl",
  "item/chhll.mdl",
  "item/chhmm.mdl",
  "item/chhnn.mdl",
  "item/chhoo.mdl",
  "item/chhpp.mdl",
  "item/chhqq.mdl",
  "item/chhrr.mdl",
  "item/chhss.mdl",
  "item/chhtt.mdl",
  "item/chhuk.mdl",
  "item/chhuu.mdl",
  "item/chhvv.mdl",
  "item/chhww.mdl",
  "item/chhxx.mdl",
  "item/chhyy.mdl",
  "item/chhzz.mdl",
  "item/chvaa.mdl",
  // "item/chvaa_kage.mdl",
  // "item/chvaa_test.mdl",
  "item/chvbb.mdl",
  // "item/corgi.mdl",
  "item/dekoboko.mdl",
  "item/dekoboko2.mdl",
  "item/disp_chcaa.mdl",
  "item/disp_chdaa.mdl",
  "item/disp_chdbb.mdl",
  "item/disp_chhaa.mdl",
  "item/disp_chvaa.mdl",
  // "item/disp_test.mdl",
  "item/en_aid.mdl",
  "item/en_ap2.mdl",
  "item/en_apb.mdl",
  "item/en_bhr.mdl",
  "item/en_ckn.mdl",
  "item/en_deb.mdl",
  "item/en_fly.mdl",
  "item/en_hpb.mdl",
  "item/en_lie.mdl",
  "item/en_lix.mdl",
  "item/en_mry.mdl",
  "item/en_nse.mdl",
  "item/en_one.mdl",
  "item/en_rod.mdl",
  "item/en_shb.mdl",
  "item/en_smb.mdl",
  "item/en_spi.mdl",
  "item/en_zbb.mdl",
  "item/face_test1.mdl",
  "item/hige_lip.mdl",
  // "item/htr_test.mdl",
  "item/it_bbook.mdl",
  "item/it_bld.mdl",
  "item/it_bld2.mdl",
  "item/it_camera.mdl",
  "item/it_can.mdl",
  "item/it_chain.mdl",
  "item/it_cl2.mdl",
  "item/it_clw.mdl",
  "item/it_ctear.mdl",
  "item/it_dagger.mdl",
  "item/it_dagger2.mdl",
  "item/it_driver.mdl",
  "item/it_dry.mdl",
  "item/it_fir.mdl",
  "item/it_hanger.mdl",
  "item/it_hgun.mdl",
  "item/it_hgun2.mdl",
  "item/it_hum.mdl",
  "item/it_jacki.mdl",
  "item/it_jerky.mdl",
  "item/it_juwaki.mdl",
  "item/it_juwaki2.mdl",
  "item/it_juwaki4.mdl",
  "item/it_juwaki5.mdl",
  "item/it_jyuwaki4.mdl",
  "item/it_knife.mdl",
  "item/it_knife2.mdl",
  "item/it_lifekey.mdl",
  "item/it_lig.mdl",
  "item/it_liv.mdl",
  "item/it_map.mdl",
  "item/it_mc2.mdl",
  "item/it_mch.mdl",
  "item/it_meatlump.mdl",
  "item/it_mkey.mdl",
  "item/it_necklace.mdl",
  "item/it_necklace2.mdl",
  "item/it_note.mdl",
  "item/it_oxi.mdl",
  "item/it_photo.mdl",
  "item/it_pipeg.mdl",
  "item/it_pipes.mdl",
  "item/it_radio2.mdl",
  "item/it_sub.mdl",
  "item/it_swo.mdl",
  "item/it_tablet.mdl",
  "item/it_tear.mdl",
  "item/it_tog.mdl",
  "item/it_trs.mdl",
  // "item/mame.mdl",
  "item/pl_htr_a.mdl",
  "item/pooh.mdl",
  "item/rchfuda.mdl",
  "item/rchhaa.mdl",
  "item/rchhbb.mdl",
  "item/rchhcc.mdl",
  "item/rchhdd.mdl",
  "item/rchhee.mdl",
  "item/rchhff.mdl",
  "item/rchhgg.mdl",
  "item/rchhhh.mdl",
  "item/rchhii.mdl",
  "item/rchhjj.mdl",
  "item/rchhkk.mdl",
  "item/rchhll.mdl",
  "item/rchhmm.mdl",
  "item/rchhnn.mdl",
  "item/rchhoo.mdl",
  "item/rchhpp.mdl",
  "item/rchhqq.mdl",
  "item/rchhrr.mdl",
  "item/rchhss.mdl",
  "item/rchhtt.mdl",
  "item/rchhuk.mdl",
  "item/rchhuu.mdl",
  "item/rchhvv.mdl",
  "item/rchhww.mdl",
  "item/rchhxx.mdl",
  "item/rchhyy.mdl",
  "item/rchhzz.mdl",
  "item/teschhaa.mdl",
  "item/test_chdcc.mdl",
  // "item/test_chdcc2.mdl",
  // "item/test_chdcc3.mdl",
  "item/test_wave.mdl",
  "item/tommy.mdl",
  "item/������ �� chdcc.mdl",
  "pl/chfuda.mdl",
  "pl/chhaa.mdl",
  "pl/chhaa_wg.mdl",
  "pl/chhbb.mdl",
  "pl/chhcc.mdl",
  "pl/chhdd.mdl",
  "pl/chhee.mdl",
  "pl/chhff.mdl",
  "pl/chhgg.mdl",
  "pl/chhhh.mdl",
  "pl/chhii.mdl",
  "pl/chhjj.mdl",
  "pl/chhkk.mdl",
  "pl/chhll.mdl",
  "pl/chhmm.mdl",
  "pl/chhnn.mdl",
  "pl/chhoo.mdl",
  "pl/chhpp.mdl",
  "pl/chhqq.mdl",
  "pl/chhrr.mdl",
  "pl/chhss.mdl",
  "pl/chhtt.mdl",
  "pl/chhuk.mdl",
  "pl/chhuu.mdl",
  "pl/chhvv.mdl",
  "pl/chhww.mdl",
  "pl/chhxx.mdl",
  "pl/chhyy.mdl",
  "pl/chhzz.mdl",
  "pl/pl_htr_a.mdl",
  "pl/pl_htr_a_bak.mdl",
  "pl/pl_htr_a_old.mdl",
  "pl/pl_htr_b.mdl",
  "pl/rchfuda.mdl",
  "pl/rchhaa.mdl",
  "pl/rchhbb.mdl",
  "pl/rchhcc.mdl",
  "pl/rchhdd.mdl",
  "pl/rchhee.mdl",
  "pl/rchhff.mdl",
  "pl/rchhgg.mdl",
  "pl/rchhhh.mdl",
  "pl/rchhii.mdl",
  "pl/rchhjj.mdl",
  "pl/rchhkk.mdl",
  "pl/rchhll.mdl",
  "pl/rchhmm.mdl",
  "pl/rchhnn.mdl",
  "pl/rchhoo.mdl",
  "pl/rchhpp.mdl",
  "pl/rchhqq.mdl",
  "pl/rchhrr.mdl",
  "pl/rchhss.mdl",
  "pl/rchhtt.mdl",
  "pl/rchhuk.mdl",
  "pl/rchhuu.mdl",
  "pl/rchhvv.mdl",
  "pl/rchhww.mdl",
  "pl/rchhxx.mdl",
  "pl/rchhyy.mdl",
  "pl/rchhzz.mdl",
  "wp/rwp_fir.mdl",
  "wp/rwp_hgun.mdl",
  "wp/rwp_hguns.mdl",
  "wp/rwp_hum.mdl",
  "wp/rwp_knife.mdl",
  "wp/rwp_lig.mdl",
  "wp/rwp_pipe.mdl",
  "wp/rwp_pipeg.mdl",
  "wp/rwp_pipes.mdl",
  "wp/rwp_sho.mdl",
  "wp/rwp_stu.mdl",
  "wp/rwp_sub.mdl",
  "wp/rwp_subs.mdl",
  "wp/rwp_swo.mdl",
  "wp/rwp_u_sub.mdl",
  "wp/rwp_u_subs.mdl",
  "wp/wp_fir.mdl",
  "wp/wp_hgun.mdl",
  "wp/wp_hguns.mdl",
  "wp/wp_hum.mdl",
  "wp/wp_knife.mdl",
  "wp/wp_lig.mdl",
  "wp/wp_pipe.mdl",
  "wp/wp_pipeg.mdl",
  "wp/wp_pipes.mdl",
  "wp/wp_sho.mdl",
  "wp/wp_stu.mdl",
  "wp/wp_sub.mdl",
  "wp/wp_subs.mdl",
  "wp/wp_swo.mdl",
  "wp/wp_u_sub.mdl",
  "wp/wp_u_subs.mdl",
].filter(excludeRModels);
function excludeRModels(value: string, _index: number, array: string[]) {
  const [folder, name] = value.split("/");
  if (
    name.startsWith("r") &&
    array.includes(`${folder}/${name.substring(1)}`)
  ) {
    return false;
  }
  return true;
}

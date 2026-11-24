# 天体序章专属美术资源

## 太阳系开场

- `solar-system-poster.webp`：从旧版 3D 开场的太阳系全景实拍帧裁切导出，1600 × 900。用于场景准备期间、减少动态效果及无法显示 3D 的设备。
- 地球表面、云层、夜间灯光和月球沿用本目录原有贴图，来源见下方。

## 微光成章（历史版本）

- `orbital-body.svg`：本项目原创天体表面，使用渐变、球面经纬刻线和 SVG 噪声光照绘制。
- `orbital-body.webp`：上述 SVG 的 960 × 960 透明栅格版本。
- `orbital-study.svg`：本项目原创星环构图，用于此前的「微光成章」版本。

在仓库根目录重新导出天体纹理（使用项目现有的 Sharp）：

```sh
node --input-type=module -e 'import sharp from "sharp"; await sharp("public/images/intro-motion-3/orbital-body.svg").webp({quality:90, alphaQuality:100}).toFile("public/images/intro-motion-3/orbital-body.webp");'
```

## 3D 场景纹理

本目录中的地球和月球纹理取自 Three.js 官方示例仓库：
https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets

保留的上游文件：earth_atmos_2048.jpg、earth_normal_2048.jpg、earth_specular_2048.jpg、earth_clouds_1024.png、earth_lights_2048.png、moon_1024.jpg。

Three.js 项目采用 MIT License：
https://github.com/mrdoob/three.js/blob/dev/LICENSE

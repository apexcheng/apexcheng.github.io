# 天体序章专属美术资源

## 微光成章

- `orbital-body.svg`：本项目原创天体表面，使用渐变、球面经纬刻线和 SVG 噪声光照绘制。
- `orbital-body.webp`：上述 SVG 的 960 × 960 透明栅格版本。运行时只加载这一份纹理，避免逐帧计算 SVG 滤镜。
- `orbital-study.svg`：本项目原创星环构图。静态路径为默认观测角度；动画与探索使用 `src/scripts/intro-motion-3.js` 的同一套几何投影更新路径。`__BODY_URL__` 由页面替换为带站点 base 的资源路径。

在仓库根目录重新导出天体纹理（使用项目现有的 Sharp）：

```sh
node --input-type=module -e 'import sharp from "sharp"; await sharp("public/images/intro-motion-3/orbital-body.svg").webp({quality:90, alphaQuality:100}).toFile("public/images/intro-motion-3/orbital-body.webp");'
```

## 旧版纹理

以下资源保留来源记录，新版天体序章不再加载它们。

本目录中的地球和月球纹理取自 Three.js 官方示例仓库：
https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets

保留的上游文件：earth_atmos_2048.jpg、earth_normal_2048.jpg、earth_specular_2048.jpg、earth_clouds_1024.png、earth_lights_2048.png、moon_1024.jpg。

Three.js 项目采用 MIT License：
https://github.com/mrdoob/three.js/blob/dev/LICENSE

---
title: "用最小抽象维护个人项目里的缓存逻辑"
description: "可读、显式、少工程化的代码组织方式。"
date: 2026-05-28
category: "数据处理"
tags:
  - "Python"
  - "缓存"
minutes: 9
featured: false
draft: false
private: false
---

## 简单优先

个人项目里的缓存逻辑通常不需要复杂管理器。先把读取、修改、保存三个步骤写清楚，再判断是否需要抽函数。

```python
cache = load_cache(file_path)
cache["items"][key] = item
save_cache(file_path, cache)
```

## 保存时机

逐项捕获异常就逐项保存，整批处理就批量末尾保存。不要让失败隔离粒度和落盘时机不一致。

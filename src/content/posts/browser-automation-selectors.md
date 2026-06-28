---
title: "网页自动化里，什么时候该用选择器而不是坐标点击？"
description: "把稳定性、可验证性和维护成本放在一起看。"
date: 2026-06-12
category: "影刀RPA"
tags:
  - "Playwright"
  - "RPA"
minutes: 8
featured: false
draft: false
private: false
---

## 背景

网页自动化脚本需要尽量使用可验证的页面元素、选择器和状态判断。坐标点击可以作为临时手段，但不应该成为主要策略。

## 选择器优先

选择器能表达“点击哪个按钮”，也更容易在页面变化时定位问题。坐标只能表达“点哪里”，很难说明业务含义。

```ts
await page.getByRole('button', { name: '提交' }).click();
await expect(page.getByText('提交成功')).toBeVisible();
```

## 结论

优先使用元素、选择器、接口和按钮状态验证。只有页面确实无法稳定定位时，再谨慎使用坐标。

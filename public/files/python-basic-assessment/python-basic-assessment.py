"""
Python 综合考核：20 题

建议用时：60～90 分钟
规则：
1. 不使用第三方库。
2. 预测题先在注释区写出状态轨迹，再运行验证。
3. 错误题要写出具体行号、异常类型和后续去向。
4. 第 17～20 题复用 A001、A002、A003 完成订单脚本。
"""

import json
from pathlib import Path


# ============================================================
# 第一组：预测输出与状态变化（01～05）
# ============================================================


# 第 01 题：字符串怎样变成库存数字
# 写出 raw_stock、stock 的值与类型，并填写完整轨迹：
# "3" → int(...) → stock = ?（类型：?）→ stock < 5 → ?
def question_01():
    raw_stock = "3"
    stock = int(raw_stock)
    print(stock < 5)


# 第 02 题：沿列表和字典找到订单状态
# 写出访问路径和输出，并说明 [0] 与 ["status"] 各自在哪种容器中查找。
def question_02():
    orders = [
        {"order_no": "A001", "status": "已支付"},
        {"order_no": "A002", "status": "已退款"},
    ]
    print(orders[0]["status"])


# 第 03 题：别名修改了哪一份数据
# 写出修改前、修改后、最终输出，并解释 alias 和 orders 的关系。
def question_03():
    orders = [
        {"order_no": "A001", "status": "已支付"},
        {"order_no": "A002", "status": "已退款"},
    ]
    alias = orders
    alias[1]["status"] = "已支付"
    print(orders[1]["status"])


# 第 04 题：条件顺序决定走哪扇门
# 写出第一个为真的条件和实际输出，再调整顺序，让 stock == 0 输出“缺货”。
def question_04():
    stock = 0
    if stock < 5:
        result = "需要补货"
    elif stock == 0:
        result = "缺货"
    else:
        result = "库存正常"
    print(result)


# 第 05 题：三轮循环怎样累积成最终结果
# 每一轮记录：当前订单、条件结果、paid_count、total_amount。
def question_05():
    orders = [
        {"order_no": "A001", "sku": "K161", "amount": 129.0, "status": "已支付"},
        {"order_no": "A002", "sku": "K162", "amount": 88.0, "status": "已退款"},
        {"order_no": "A003", "sku": "K161", "amount": 199.0, "status": "已支付"},
    ]
    paid_count = 0
    total_amount = 0.0
    for order in orders:
        if order["status"] == "已支付":
            paid_count += 1
            total_amount += order["amount"]
    print(paid_count, total_amount)


# ============================================================
# 第二组：完成基础代码（06～12）
# ============================================================


# 第 06 题：转换库存并判断是否补货
# 期望输出：K161 需要补货：True
def question_06():
    sku = "K161"
    raw_stock = "3"
    # 在这里补全
    pass


# 第 07 题：修改嵌套订单状态
# 只写一行代码，把 A002 的状态从“已退款”改成“已支付”。
def question_07():
    orders = [
        {"order_no": "A001", "status": "已支付"},
        {"order_no": "A002", "status": "已退款"},
    ]
    # 在这里补全
    print(orders[1]["status"])


# 第 08 题：补全库存分类函数
# 必须按顺序处理：等于 0、小于 5、其他。
def classify_stock(stock):
    # 在这里补全
    pass


def question_08():
    print(classify_stock(0))
    print(classify_stock(3))
    print(classify_stock(10))


# 第 09 题：筛选已支付订单并汇总
# 得到 paid_orders、paid_count、total_amount。
def question_09():
    orders = [
        {"order_no": "A001", "sku": "K161", "amount": 129.0, "status": "已支付"},
        {"order_no": "A002", "sku": "K162", "amount": 88.0, "status": "已退款"},
        {"order_no": "A003", "sku": "K161", "amount": 199.0, "status": "已支付"},
    ]
    # 在这里补全
    pass


# 第 10 题：用 return 交出订单金额
# 公式：单价 × 数量 × (1 - 折扣率)，调用结果应为 232.2。
def calculate_order_amount(price, quantity, discount_rate):
    # 在这里补全，必须使用 return
    pass


def question_10():
    amount = calculate_order_amount(129.0, 2, 0.1)
    print(amount)


# 第 11 题：让汇总结果往返 JSON
# 中文不能显示成 Unicode 转义；把 JSON 字符串再转回 Python 字典。
def question_11():
    summary = {"paid_count": 2, "total_amount": 328.0, "status": "已完成"}
    # 在这里补全 json.dumps 与 json.loads
    pass


# 第 12 题：读取同目录测试文件
# 使用 pathlib.Path 和 UTF-8；从任意工作目录启动时都能找到 test.txt。
def question_12():
    # 提示：先找到当前 .py 文件所在目录，再拼接 test.txt
    pass


# ============================================================
# 第三组：沿错误路径定位（13～16）
# ============================================================


# 第 13 题：中文数字无法转换
# 对应网页编号：
# 1  raw_stock = "三"
# 2  stock = int(raw_stock)
# 3  print(stock < 5)
# 写出出错行、异常类型、stock 是否创建、第 3 行是否执行。
def question_13():
    raw_stock = "三"
    stock = int(raw_stock)
    print(stock < 5)


# 第 14 题：文件不存在
# 对应网页编号：
# 1  from pathlib import Path
# 2  path = Path("missing-orders.json")
# 3  text = path.read_text(encoding="utf-8")
# 4  print(text)
# 写出出错行、异常类型，并解释为什么创建 Path 时没有报错。
def question_14():
    path = Path("missing-orders.json")
    text = path.read_text(encoding="utf-8")
    print(text)


# 第 15 题：JSON 格式不合法
# 对应网页编号：
# 1  import json
# 2  text = '[{"order_no": "A001",}]'
# 3  orders = json.loads(text)
# 4  print(orders[0]["order_no"])
# 写出出错行、异常类型、第 4 行是否执行，以及格式问题。
def question_15():
    text = '[{"order_no": "A001",}]'
    orders = json.loads(text)
    print(orders[0]["order_no"])


# 第 16 题：坏金额怎样被记录后跳过
# 每一轮写出：转换成功 / 异常 / continue 后去向；再写最终三项状态。
def question_16():
    raw_orders = [
        {"order_no": "A001", "amount": "129.0"},
        {"order_no": "A002", "amount": "未知"},
        {"order_no": "A003", "amount": "199.0"},
    ]
    clean_orders = []
    problems = []
    total_amount = 0.0
    for order in raw_orders:
        try:
            amount = float(order["amount"])
        except ValueError as error:
            problems.append(
                {"order_no": order["order_no"], "error": type(error).__name__}
            )
            continue
        clean_orders.append(order["order_no"])
        total_amount += amount


# ============================================================
# 第四组：完成订单脚本（17～20）
# ============================================================


ORDERS = [
    {"order_no": "A001", "sku": "K161", "amount": 129.0, "status": "已支付"},
    {"order_no": "A002", "sku": "K162", "amount": 88.0, "status": "已退款"},
    {"order_no": "A003", "sku": "K161", "amount": 199.0, "status": "已支付"},
]


# 第 17 题：实现单条订单清洗函数
# 四个必需字段；文本 strip；order_no、sku 转大写；amount 转 float；返回新字典。
def normalize_order(raw_order):
    # 在这里补全，缺少必需字段时保留 KeyError
    pass


# 第 18 题：实现已支付汇总函数
# 返回 paid_order_nos、paid_count、total_amount 三个字段。
def build_summary(orders):
    # 在这里补全
    pass


# 第 19 题：画出四个函数之间的数据交接
# 不必直接运行；在每行后写出“输入形状 → 输出形状”，并回答网页中的三个问题。
def question_19(input_path, output_path):
    raw_orders = load_orders(input_path)  # noqa: F821
    clean_orders = [normalize_order(order) for order in raw_orders]
    summary = build_summary(clean_orders)
    write_summary(output_path, summary)  # noqa: F821


# 第 20 题：让坏订单退出当前路径，而不是拖垮整批任务
# A003 的 amount 改成“未知”，完成：normalize_order → except → problems → continue。
# 预期：已支付只有 A001；paid_count=1；total_amount=129.0；问题数=1。
def question_20():
    raw_orders = [
        {"order_no": "A001", "sku": "K161", "amount": 129.0, "status": "已支付"},
        {"order_no": "A002", "sku": "K162", "amount": 88.0, "status": "已退款"},
        {"order_no": "A003", "sku": "K161", "amount": "未知", "status": "已支付"},
    ]
    clean_orders = []
    problems = []
    # 在这里补全清洗、异常记录、continue 和汇总
    pass


# ============================================================
# 选修加分题（不计入 20 题）
# ============================================================
# 先预测两行输出，再解释 self 为什么只修改 product1。
class Product:
    def __init__(self, sku, stock):
        self.sku = sku
        self.stock = stock

    def add_stock(self, quantity):
        self.stock += quantity


def optional_bonus():
    product1 = Product("K161", 3)
    product2 = Product("K162", 10)
    product1.add_stock(5)
    print(product1.stock)
    print(product2.stock)


if __name__ == "__main__":
    print("请打开本文件，按网页中的 20 道题逐题作答。")

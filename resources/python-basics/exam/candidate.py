"""Python 正式考核答题文件。将 TODO 替换为自己的代码，不修改函数名称或参数。"""


def b02_orders():
    data = {
        "shop": "A店",
        "orders": [
            {"id": "A001", "status": "已支付"},
            {"id": "A002", "status": "待发货"},
            {"id": "A003", "status": "已退款"},
        ],
    }
    # TODO: 获取修改前的第二条订单状态，修改该状态，提取全部订单编号。
    old_status = None
    ids = []
    return old_status, data, ids


def check_stock(stock):
    # TODO: B04。使用 return 返回对应文字。
    raise NotImplementedError


def summarize(orders):
    # TODO: B05。返回 paid_count / total_amount / bad_ids。
    raise NotImplementedError


def merge_orders(old, new):
    # TODO: A01。去重、覆盖、重复执行稳定，不修改输入。
    raise NotImplementedError


def attach_product_names(orders, products):
    # TODO: A03。构造 sku -> name 字典，补充匹配订单名称并返回 orders。
    raise NotImplementedError


if __name__ == "__main__":
    # 可自行添加测试代码；不强制在此处打印结果。
    pass

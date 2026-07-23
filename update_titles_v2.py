#!/usr/bin/env python3
"""
第二版标题优化：直白、目标导向、成体系
格式统一：[概念名]：[学习目标描述]
只替换第一行标题，不改动引流卡片等其他内容
"""

import os

# 使用 "chapter/filename" 作为 key，解决同名文件问题
TITLE_MAP = {
    # ========== Chapter 1 - 计算机基础 ==========
    "chapter1/64位内存限制": "64位内存限制：进程地址空间的边界与实际可用内存",
    "chapter1/CPU缓存与Redis缓存": "CPU缓存与Redis缓存：多级缓存的层次设计与一致性策略",
    "chapter1/JVM启动过程": "JVM启动过程：类加载、字节码验证与解释执行的完整链路",
    "chapter1/JVM垃圾回收": "JVM垃圾回收：GC算法对比、分代模型与停顿时间调优",
    "chapter1/SSD写入放大": "SSD写入放大：闪存擦写机制与写入性能衰减的底层原因",
    "chapter1/大小端序": "大小端序：字节序存储差异与网络字节序统一标准",
    "chapter1/并发安全与CAS": "并发安全与CAS：无锁编程的原子操作原理与ABA问题",
    "chapter1/开机启动过程": "开机启动过程：从BIOS自检到操作系统就绪的完整启动链路",
    "chapter1/数组越界": "数组越界：缓冲区溢出原理与C语言内存安全防护",
    "chapter1/树莓派GPIO": "树莓派GPIO：硬件接口编程入门与物理设备控制",
    "chapter1/浮点数精度": "浮点数精度：IEEE 754存储机制与精度损失的工程应对",
    "chapter1/系统调用与零拷贝": "系统调用与零拷贝：用户态与内核态数据传输的四种优化方案",
    "chapter1/虚拟内存": "虚拟内存：进程地址空间、页表映射与缺页中断机制",
    "chapter1/进程线程协程": "进程线程协程：三种并发模型的调度原理与资源开销对比",
    "chapter1/键盘输入链路": "键盘输入链路：从硬件中断到字符显示的完整数据通路",

    # ========== Chapter 2 - 网络 ==========
    "chapter2/DNS分布式目录": "DNS解析系统：分层域名解析架构与缓存策略",
    "chapter2/HTTPS证书链验证": "HTTPS证书链验证：TLS握手流程与证书信任链验证机制",
    "chapter2/HTTP三代进化": "HTTP协议演进：从HTTP/1.1到HTTP/3的性能瓶颈与解决方案",
    "chapter2/IPv4到IPv6的切换困境": "IPv4到IPv6迁移：协议兼容性障碍与过渡技术方案",
    "chapter2/NAT地址转换": "NAT地址转换：IPv4地址耗尽问题与端口映射穿透原理",
    "chapter2/TCP-vs-UDP的选择": "TCP与UDP对比：可靠传输与不可靠传输的适用场景选择",
    "chapter2/WebSocket-vs-长轮询-vs-SSE": "实时推送方案对比：WebSocket、长轮询与SSE的技术选型",
    "chapter2/WiFi满格却不能上网": "WiFi连接故障排查：从信号强度到网络可达性的分层诊断",
    "chapter2/从零设计可靠传输协议": "可靠传输协议设计：确认重传、滑动窗口与拥塞控制机制",
    "chapter2/设计CDN系统": "CDN系统设计：内容缓存的分发策略与调度机制",
    "chapter2/设计P2P文件分发系统": "P2P文件分发系统设计：去中心化传输架构与NAT穿透方案",
    "chapter2/负载均衡算法选择": "负载均衡算法：轮询、加权、一致性哈希的原理与选型",
    "chapter2/跨地域网络延迟分析": "跨地域网络延迟：物理距离对延迟的影响与优化手段",
    "chapter2/输入URL到页面渲染全链路": "URL到页面渲染全链路：DNS解析到DOM渲染的完整流程",

    # ========== Chapter 3 - 架构设计 ==========
    "chapter3/API网关的设计与高可用": "API网关设计：路由转发、限流熔断与高可用方案",
    "chapter3/OTA升级系统的设计": "OTA升级系统设计：固件分发、差分升级与灰度回滚机制",
    "chapter3/Redis为什么快": "Redis高性能原理：单线程模型、IO多路复用与内存数据结构",
    "chapter3/分布式ID生成器的设计": "分布式ID生成器设计：雪花算法、号段模式与UUID方案对比",
    "chapter3/分布式事务的方案选型": "分布式事务方案选型：2PC、TCC、Saga与本地消息表对比",
    "chapter3/分库分表的设计与实践": "分库分表实践：分片策略、跨库查询与数据迁移方案",
    "chapter3/千万级用户登录系统设计": "千万级登录系统设计：Session管理与Token认证方案",
    "chapter3/微服务vs单体架构的选择": "微服务与单体架构选择：服务拆分时机与演进策略",
    "chapter3/支付系统的幂等与对账设计": "支付系统设计：幂等控制、防重复扣款与资金对账",
    "chapter3/智能家居设备影子模型": "设备影子模型设计：离线设备状态同步与变更通知机制",
    "chapter3/消息队列的设计与Kafka原理": "Kafka原理剖析：分区、副本、消费组与高吞吐存储设计",
    "chapter3/热更新系统的设计与安全": "热更新系统设计：动态修复原理与安全边界控制",
    "chapter3/短链接系统设计": "短链接系统设计：发号器、哈希映射与缓存方案",
    "chapter3/秒杀系统的四层防线": "秒杀系统设计：流量削峰、缓存预热与库存扣减的四层防线",
    "chapter3/缓存穿透击穿雪崩": "缓存穿透、击穿与雪崩：三种缓存故障的区别、成因与防御方案",
    "chapter3/配置中心的设计与FeatureFlag": "配置中心设计：动态配置管理与Feature Flag灰度发布",

    # ========== Chapter 4 - 安全 ==========
    "chapter4/CSRF跨站请求伪造": "CSRF跨站请求伪造：攻击原理与Token防御方案",
    "chapter4/DDoS攻防": "DDoS攻击防御：流量攻击类型识别与多层防御体系",
    "chapter4/HTTPS证书链验证": "HTTPS证书链验证：TLS握手流程与证书信任链验证机制",
    "chapter4/OAuth2.0授权模式": "OAuth 2.0授权机制：四种授权流程与扫码登录实现",
    "chapter4/SIM-Swap攻击": "SIM卡交换攻击：攻击链路分析与防护措施",
    "chapter4/SQL注入攻防": "SQL注入攻防：注入原理、攻击手法与参数化查询防御",
    "chapter4/SSO单点登录设计": "SSO单点登录设计：CAS协议与Token共享方案",
    "chapter4/XSS跨站脚本攻击": "XSS跨站脚本攻击：存储型、反射型与DOM型防御策略",
    "chapter4/侧信道攻击": "侧信道攻击：时序、功耗与声学等旁路攻击原理",
    "chapter4/哈希加密签名的本质区别": "哈希、加密与签名：三个概念的本质区别与适用场景",
    "chapter4/密码存储系统设计": "密码存储系统设计：从MD5到Argon2的加密方案演进",
    "chapter4/对称加密vs非对称加密": "对称与非对称加密：混合加密体系的工作原理与分工",
    "chapter4/接口防刷系统设计": "接口防刷系统设计：限流算法与风控规则引擎",
    "chapter4/撞库攻击": "撞库攻击：密码复用风险与多因素认证方案",
    "chapter4/被拖库的数据": "数据泄露分析：拖库后数据的利用链路与防护措施",
    "chapter4/记住密码与自动登录": "自动登录机制：Token存储方案与安全设计",
    "chapter4/防暴力破解登录接口": "登录接口防爆破：频率限制、验证码与账号锁定策略",
    "chapter4/零信任vs边界防御": "零信任与边界防御：安全架构演进与零信任原则",
    "chapter4/风控系统设计": "风控系统设计：规则引擎与机器学习风控模型",
    "chapter4/验证码军备竞赛": "验证码技术演进：人机识别的发展与AI对抗",

    # ========== Chapter 5 - 工程实践 ==========
    "chapter5/CICD流水线全流程": "CI/CD流水线设计：从代码提交到自动部署的完整链路",
    "chapter5/Git-Merge-vs-Rebase": "Git合并策略：Merge与Rebase的区别与团队规范",
    "chapter5/RESTful-API设计": "RESTful API设计：资源导向的接口设计原则与最佳实践",
    "chapter5/云服务器采购配置": "云服务器选型：计算资源配置的决策框架与成本优化",
    "chapter5/北极星看板设计": "北极星指标体系：指标定义、数据采集与看板设计",
    "chapter5/单体vs微服务": "架构选型决策：单体与微服务的适用场景与转型时机",
    "chapter5/发布策略": "发布策略对比：蓝绿、金丝雀与滚动发布的选型与实施",
    "chapter5/可观测性": "可观测性体系：日志、指标与链路追踪三大支柱",
    "chapter5/埋点设计": "埋点设计规范：用户行为数据采集与分析体系",
    "chapter5/基准测试": "基准测试方法论：性能测试设计、执行与常见陷阱",
    "chapter5/技术债": "技术债管理：识别、量化与偿还策略",
    "chapter5/测试金字塔": "测试金字塔实践：单元测试、集成测试与E2E的比例分配",
    "chapter5/线上运维高危操作": "运维高危操作：危险命令识别与防护机制设计",
    "chapter5/运维监控指标设计": "监控指标设计：RED方法与USE方法的监控体系搭建",
    "chapter5/造轮子决策": "造轮子决策：自研与开源方案的评估框架",
    "chapter5/防呆处理设计": "防呆设计：错误预防机制与工程容错实践",
    "chapter5/需求文档": "需求文档规范：从用户故事到技术方案的书写方法",
    "chapter5/非功能需求": "非功能需求：性能、可用性、安全性等维度的验收标准",

    # ========== Chapter 6 - 分布式系统 ==========
    "chapter6/CAP定理": "CAP定理：一致性、可用性与分区容错的权衡分析",
    "chapter6/K8s自愈原理": "Kubernetes自愈机制：健康检查与Pod自动恢复原理",
    "chapter6/Raft共识算法": "Raft共识算法：Leader选举与日志复制的实现原理",
    "chapter6/分布式事务": "分布式事务方案：跨数据库事务的五种解决方案对比",
    "chapter6/可观测性": "分布式可观测性：链路追踪与服务依赖关系分析",
    "chapter6/大文件搜索替换": "大文件处理：GB级日志的流式搜索与替换技巧",
    "chapter6/容器vs虚拟机": "容器与虚拟机：Docker与VM的架构差异与隔离机制",
    "chapter6/熔断机制": "熔断机制设计：断路器模式与故障隔离策略",
    "chapter6/设备影子": "设备影子模型：IoT设备状态同步与离线管理方案",

    # ========== Chapter 7 - AI与算法 ==========
    "chapter7/AI幻觉": "AI幻觉问题：大模型生成错误信息的成因与缓解策略",
    "chapter7/Attention机制": "Attention机制：Transformer自注意力的计算原理与作用",
    "chapter7/GPU-vs-CPU": "GPU与CPU对比：并行计算架构差异与AI训练硬件选择",
    "chapter7/MapReduce": "MapReduce模型：分布式数据处理编程模型与实现原理",
    "chapter7/人脸识别vs图像分类": "计算机视觉任务：人脸识别与图像分类的层次关系",
    "chapter7/哈希表vsB+树": "索引数据结构：哈希表与B+树的适用边界与选型",
    "chapter7/图灵机到大语言模型": "计算模型演进：从图灵机到ChatGPT的80年发展历程",
    "chapter7/大模型涌现": "大模型涌现能力：规模效应与能力突现的临界点分析",
    "chapter7/布隆过滤器": "布隆过滤器：概率数据结构原理与误判率控制",
    "chapter7/强化学习vs监督学习": "强化学习与监督学习：两种学习范式的本质区别",
    "chapter7/排序算法": "排序算法对比：时间复杂度、稳定性与适用场景分析",
    "chapter7/推荐系统冷启动": "推荐系统冷启动：无数据场景下的五种推荐策略",
    "chapter7/梯度下降": "梯度下降算法：神经网络优化的核心原理与变体",
    "chapter7/过拟合": "过拟合问题：模型泛化能力不足的诊断与治理方法",
}


def main():
    articles_dir = '/Volumes/dz/code/kepu-book/articles'
    processed = 0
    skipped = 0

    for root, dirs, files in os.walk(articles_dir):
        for filename in sorted(files):
            if not filename.endswith('.md'):
                continue
            filepath = os.path.join(root, filename)
            basename = os.path.splitext(filename)[0]
            chapter = os.path.basename(root)
            key = f"{chapter}/{basename}"

            new_title = TITLE_MAP.get(key)
            if not new_title:
                print(f"  [SKIP] {key} - no mapping")
                skipped += 1
                continue

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            lines = content.split('\n')
            if not lines:
                skipped += 1
                continue

            old_title_line = lines[0]
            old_title = old_title_line.lstrip('#').strip()

            lines[0] = f"# {new_title}"
            new_content = '\n'.join(lines)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"  [OK] {key}")
            print(f"       OLD: {old_title}")
            print(f"       NEW: {new_title}")
            processed += 1

    print(f"\n{'='*60}")
    print(f"Done: {processed} articles updated, {skipped} skipped")


if __name__ == '__main__':
    main()

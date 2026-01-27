---
title: "CS149-Assign1: Analyzing Parallel Program Performance on a Quad-Core CPU"
published: 2026-01-27
description: "本文记录了 CS149 Assignment 1 的完成过程，分析了不同并行程序在四核 CPU 上的性能表现，探讨了并行化策略与性能优化方法。"
image: ""
tags: ["并行计算","性能分析","多核","CS149","Assignment1"]
category: "高性能计算"
draft: false
lang: ""
---


## 作业概述

CS149 是斯坦福大学的并行计算课程。本次作业包含 6 个程序，分别练习不同的并行技术：

- **Program 1**: 多线程 Mandelbrot 集渲染（理解线程与工作负载均衡）
- **Program 2**: SIMD 向量化（理解向量化与 lane utilization）
- **Program 3**: ISPC 并行语言（SPMD 与 task 并行）
- **Program 4:** sqrt 函数向量化（理解数据依赖与最佳/最差情况）
- **Program 5**: SAXPY 内存带宽（理解 memory-bound 程序）
- **Program 6**: K-Means 聚类并行化（真实算法的性能分析与优化）

本实验在 **Ryzen 5 9600x**（6 核 12 线程）上完成。

## 作业相关资源

仓库：[Github - mistcoversmyeyes/CS149_ASS1](https://github.com/mistcoversmyeyes/CS149_ASS1#)




## Program 1: 编码并分析多线程绘制 Mandelbrot set 的性能

首先查看一下这个项目给出的串行实现的核心代码部分：

```cpp
// MandelbrotSerial --
//
// 计算可视化曼德布洛特集的图像。结果数组包含在复数对应于像素
// 被拒绝出集合之前所需的迭代次数。
//
// * x0, y0, x1, y1 描述映射到图像视口的复坐标。
// * width, height 描述输出图像的大小
// * startRow, totalRows 描述要计算的图像部分
void mandelbrotSerial(
    float x0, float y0, float x1, float y1,
    int width, int height,
    int startRow, int totalRows,
    int maxIterations,
    int output[])
{
    float dx = (x1 - x0) / width;
    float dy = (y1 - y0) / height;

    int endRow = startRow + totalRows;

    for (int j = startRow; j < endRow; j++) {
        for (int i = 0; i < width; ++i) {
            float x = x0 + i * dx;
            float y = y0 + j * dy;

            int index = (j * width + i);
            output[index] = mandel(x, y, maxIterations);
        }
    }
}
```

其中 `startRow` 和 `totalRows` 是需要我们自行调整的，其他都不需要进行调整。

参数 `startRow` 表示渲染开始的行；参数 `totalRows` 表示渲染的行数；

比如你的图像是 1920 $$\times$$1080 的，有1080行像素需要渲染，如果使用线程渲染就传入参数&#x20;

```assembly&#x20;language
mandelbrotSerial(x0,y0,x1,y1,width,height,0,1080,....)
```



### 任务 1：使用两个线程并行绘制图像的上下部分

直接开两个线程，一个负责上半部分，一个负责下半部分就可以了

```c++
//
// workerThreadStart --
//
// 线程入口点。
void workerThreadStart(WorkerArgs * const args) {

    // CS149 学生待办事项：在这里实现工作线程的主体。
    // 每个线程都应该调用 mandelbrotSerial() 来计算输出图像的一部分。
    // 例如，在一个使用两个线程的程序中，线程 0 可以计算图像的上半部分，
    // 线程 1 
    int numRow = args->height/args->numThreads;
    int startRow = args->threadId * numRow;
    mandelbrotSerial(
        args->x0,args->y0,args->x1,args->y1,
        args->width,args->height,
        startRow,numRow,
        args->maxIterations,
        args->output
        );
}
```

### 任务 2：按照任务1的思路，使用多个线程同时进行绘制

`workerThreadStart()` 的代码不做修改，仅仅是提高设置的线程数，比如有8个线程就将整个图像切成等宽的8个长条部分，然后分配给每个线程进行计算。

### 任务 3：在每个线程中插入计时代码以评估各个线程运行时间差异，思考为什么加速比不及预期。

```c
// 仿照main函数中的计时模块，在 workder的开头和结尾加上计时部分就可以了
void workerThreadStart(WorkerArgs * const args) {
    double startTime = CycleTimer::currentSeconds();
    
    // excicsting code...........
    
    // 线程结束计时
    double endTime = CycleTimer::currentSeconds();
    printf("    [Thread %d]:\t\t[%.3f] ms\n", args->threadId, (endTime - startTime) * 1000);
}
```



### 任务 4：尝试改变为线程分配的任务的方式，提升加速比（提示：有一种非常简单的分配任务方式能够均分工作时间）



### 任务 5：现在使用16个线程运行改进后的代码。性能是否明显优于使用8个线程时？为什么？



### 参考

- [Stanford-CS149-并行计算-Assignment1-指南](https://zhuanlan.zhihu.com/p/7554656902) — 这篇文章提供了详细的任务提示、实现思路和调试方法，对完成作业非常有帮助。

---

## Program 2: 使用内嵌SIMD 原语向量化代码

前面我们通过多线程实现了并行计算。现在我们探索另一种并行方式：**SIMD（单指令多数据）**。与多线程不同，SIMD 让一条指令同时处理多个数据，通过向量化（vectorization）来提升性能。

### 示例代码 `absVec()` 不能够正确处理所有的输入的原因

下面代码中的注释回答了这个问题

（未完成此部分）

### 任务 1：在`clampedVector()` 函数中实现 `clampedSerial()` 的向量化版本

```cpp
// 接收一个值数组和一个指数数组
//
// 对每个元素，计算 values[i]^exponents[i] 并将结果限制在 9.999 以内。结果存储到 output。
void clampedExpSerial(float *values, int *exponents, float *output, int N)
{
  for (int i = 0; i < N; i++)
  {                             //__cs149_mask mask_all_one = _cs149_init_ones(); 
    float x = values[i];        //__cs149_vec_float x; _cs149_vload_float(x,values + i,mask_all_one);
    int y = exponents[i];       //__cs149_vec_int y;  
    if (y == 0)                 //__cs149_mask mask_if_zero; _cs149_veq_int(mask_if_zero,0,y,mask_all_one);
    {                           //__cs149_vec_float one = _cs149_vset_float(1.f);
      output[i] = 1.f;          //_cs149_vstore_float(output + i,one,mask_if_zero);
    }     
    else                        //__cs149_mask mask_if_not_zero = _cs149_mask_not(mask_if_zero);
    {                           //__cs149_vec_float nine_nine; _cs149_vset_float(nine_nine,9.999999f,mask_if_not_zero);
      float result = x;         //__cs149_vec_float result; _cs149_vload_float(result,x,mask_if_not_zero);
      int count = y - 1;        //__cs149_vec_int count;  _cs149_vsub_int(count,y,1,mask_if_not_zero);
      while (count > 0)         //__cs149_mask mask_count_biger_than_0;  _cs149_vgt_int(mask_count_biger_than_0,count,0,mask_if_not_zero);
      {                         //__cs149_mask mask_in_while = _cs149_mask_and(mask_count_biger_than_0, mask_if_not_zero);
        result *= x;            //_cs149_vmult_float(result,result,x,mask_in_while);
        count--;                //_cs149_vsub_int(count,count,1,mask_in_while);
      }
      if (result > 9.999999f)   //__cs149_mask mask_over99; _cs149_vgt_float(mask_over99,result,nine_nine,mask)
      {                         //__cs149_mask mask_not0_and_over99 = _cs149_mask_and(mask_over99, mask_if_not_zero);
        result = 9.999999f;     //_cs149_vset_float(result,nine_nine, mask_not0_and_over99);
      }
      output[i] = result;       //_cs149_vstore_float(output + i, result, mask_if_not_zero);
    }
  }
}

void clampedExpVector(float *values, int *exponents, float *output, int N)
{

  //
  // CS149 STUDENTS TODO: Implement your vectorized version of
  // clampedExpSerial() here.
  //
  // Your solution should work for any value of
  // N and VECTOR_WIDTH, not just when VECTOR_WIDTH divides N
  //
  for (int i = 0; i < N; i += VECTOR_WIDTH) {
    __cs149_mask mask_all_one = _cs149_init_ones();
    __cs149_vec_float x;
    _cs149_vload_float(x, values + i, mask_all_one);
    __cs149_vec_int y;
    _cs149_vload_int(y, exponents + i, mask_all_one);
    
    __cs149_vec_int zero_int = _cs149_vset_int(0);
    __cs149_mask mask_if_zero;
    _cs149_veq_int(mask_if_zero, y, zero_int, mask_all_one);
    __cs149_vec_float one = _cs149_vset_float(1.f);
    __cs149_vec_float result;
    _cs149_vset_float(result, 1.f, mask_if_zero);
    
    __cs149_mask mask_if_not_zero = _cs149_mask_not(mask_if_zero);
    __cs149_vec_float nine_nine = _cs149_vset_float(9.999999f);
    _cs149_vmove_float(result, x, mask_if_not_zero);
    __cs149_vec_int one_int = _cs149_vset_int(1);
    __cs149_vec_int count;
    _cs149_vsub_int(count, y, one_int, mask_if_not_zero);
    
    while (true) {
      __cs149_vec_int zero_int_cmp = _cs149_vset_int(0);
      __cs149_mask mask_count_bigger_than_0;
      _cs149_vgt_int(mask_count_bigger_than_0, count, zero_int_cmp, mask_if_not_zero);
      __cs149_mask mask_in_while = _cs149_mask_and(mask_count_bigger_than_0, mask_if_not_zero);
      if (_cs149_cntbits(mask_in_while) == 0) break;
      _cs149_vmult_float(result, result, x, mask_in_while);
      _cs149_vsub_int(count, count, one_int, mask_in_while);
    }
    
    __cs149_mask mask_over99;
    _cs149_vgt_float(mask_over99, result, nine_nine, mask_if_not_zero);
    __cs149_mask mask_not0_and_over99 = _cs149_mask_and(mask_over99, mask_if_not_zero);
    _cs149_vset_float(result, 9.999999f, mask_not0_and_over99);
    
    _cs149_vstore_float(output + i, result, mask_all_one);
  }
  
}

```

### 任务 2： 运行 `./myexp -s 10000`，并将向量宽度从 2、4、8 到 16 进行扫描。记录相应的向量利用率。

![](./images/index/CS149-Assign1!%20Analyzing%20Parallel%20Program%20Performance%20on%20a%20Quad-Core%20CPU-{B515419F-C416-468D-8D2A-D971F6DFBEAB}.png)

![](./images/index/CS149-Assign1!%20Analyzing%20Parallel%20Program%20Performance%20on%20a%20Quad-Core%20CPU-{25B50012-64FC-4C45-80F4-94AE53B8738F}.png)

![](./images/index/CS149-Assign1!%20Analyzing%20Parallel%20Program%20Performance%20on%20a%20Quad-Core%20CPU-{7F56C501-3E45-4E69-8973-EBBE2E5D2883}.png)

![](./images/index/CS149-Assign1!%20Analyzing%20Parallel%20Program%20Performance%20on%20a%20Quad-Core%20CPU-{A2BEE6EB-2560-40B9-B6EC-952058212FEE}.png)


---

## Program 3: ISPC 并行语言（SPMD 与 task 并行）

手动编写 SIMD 代码既繁琐又容易出错。**ISPC（Intel SPMD Program Compiler）** 提供了更高层的抽象，让我们用类似 C 的语法编写向量化代码，编译器自动生成优化的 SIMD 指令。

### 运行给出的示例代码结果

我的运行结果

```markdown
[mandelbrot serial]:            [114.536] ms
Wrote image file mandelbrot-serial.ppm
[mandelbrot ispc]:              [26.475] ms
Wrote image file mandelbrot-ispc.ppm
[mandelbrot multicore ispc]:    [6.575] ms
Wrote image file mandelbrot-task-ispc.ppm
                                (4.33x speedup from ISPC)
                                (17.42x speedup from task ISPC)
```



### 不使用task的代码加速比低于理论上的 8x 的原因

为什么加速比只有 4.3x 而不是理论上的 8x？让我们建立模型分析。

**设：**
$$
\begin{aligned}
& W = \text{向量宽度（本例中为 8）} \\
& U = \text{平均活跃 lane 数量（理想情况下为 } W \text{，但实际会因为分支和掩码而降低）} \\
& F = \text{频率比} = \frac{AVX2\_freq}{scalar\_freq} \leq 1 \quad \text{（使用 AVX2 指令时 CPU 可能降频）} \\
& O = \text{其他开销系数（指令调度、掩码计算、不可并行部分），} 0 \le O \le 1
\end{aligned}
$$

**理想情况**：$\mathrm{speedup} = W$

**现实情况**：$\mathrm{speedup} = U \times F \times O$

对于 Mandelbrot 集渲染：
- 位于边界部分的点迭代次数较中心处的点多，导致平均活跃的 lane 数量无法达到 8，估计约为 6
- 存在掩码计算和控制流开销
- AVX2 指令可能导致 CPU 轻微降频

因此，实际加速比约为 $$6 \times 0.9 \times 0.8 \approx 4.3\mathtt{x}$$



### 优化 `ispc_task` 代码

创建任务数 = 本机最大线程数能够达到最佳效果

任务数超过线程数可能导致执行结果错误



### `task` 模型与任务 1 中的线程模型的区别

task 抽象只定义了工作内容是什么，不指定该内容必须在某个线程中完成，因此，可以动态的根据线程的空闲状况将任务分配给物理线程。线程抽象一开始就为每个线程分配好了要做的东西，一直做下去就行了。



| **项目**      | **线程**           | **Task**                             |
| ----------- | ---------------- | ------------------------------------ |
| 创建成本        | 高（OS 参与，栈分配）     | 低（对象/闭包/函数指针 + 入队）                   |
| 上下文切换<br /> | OS 级（寄存器+可能的内核态） | 多任务在同一线程按顺序执行，无 OS 切换；仅当任务间抢占/窃取需要同步 |
| 销毁成本        | 高                | 低（完成后回收结构或复用）                        |


---

## Program 4: sqrt 函数向量化（理解数据依赖与最佳/最差情况）

前面的程序展示了 SIMD 的强大威力，但实际效果很大程度上取决于**数据特性**。本节通过 `sqrt` 函数的向量化，探讨输入数据如何影响向量化加速比。

### 运行既有程序加速比

下面是我直接运行所给程序的结果：

```plain&#x20;text
[sqrt serial]:          [509.995] ms
[sqrt ispc]:            [107.100] ms
[sqrt task ispc]:       [15.330] ms
                                (4.76x speedup from ISPC)
                                (33.27x speedup from task ISPC)
```

可以看到 经过SIMD 优化后能够达到 4.76x的加速比

然后经过任务拆分能够达到33.27x的加速比



### 通过修改 `values` 数组来达到最大/最小加速比

经过实验测试，在本机（Ryzen 9600x）上，达到极大极小加速比的情形如下：

* values 数组的所有值均为 2.8f的时候，能够达到向量化代码的最大加速比。

* values 数组的所有值均为 1.0f 的时候，能够达到向量化代码的最小加速比（此时相关计算过程为数据密集型）。

* values 数组的所有值均为 2.99f 的时候，能够达到 ispc\_tasks 的最大加速比。

* values 数组的所有值均为 1.0f 的时候，同时也能够达到多核优化 + 向量化代码的最小加速比。

```cpp
        // TODO: CS149 学生。尝试根据讲义中的说明修改数组中的值：
        // 我们希望你生成最佳和最差情况下的加速比。
        
        // 初始代码用随机输入值填充数组
        values[i] = .001f + 2.998f * static_cast<float>(rand()) / RAND_MAX;
        
        // 单核向量化版本加速比最大输入，加速比 6x
        // values[i] = 2.8f;

        // 单核向量化加速比最小输入，加速比 2x
        // values[i] = 1.0f;

        // ispc with tasks 加速比最大输入, 加速比 33x
        // values[i] = 2.99f;

        // ispc with tasks 加速比最小的输入, 加速比 2x
        // values[i] = 1.0f;

```



### 手动使用 intel 内联函数编写 AVX2 向量化后的代码

TODO：手动编写


---

## Program 5: SAXPY 内存带宽（理解 memory-bound 程序）

前面的例子都是**计算密集型（compute-bound）**程序，优化计算能力可以显著提升性能。但有些程序的瓶颈不在计算，而在**内存访问**。SAXPY（Single-Precision A·X Plus Y）是一个典型的例子。

### 运行既有程序，比较运行时间

直接编译运行已有程序，得到如下结果：

```plain&#x20;text
[saxpy serial]:         [5.376] ms      [55.431] GB/s   [7.440] GFLOPS
[saxpy ispc]:           [5.253] ms      [56.730] GB/s   [7.614] GFLOPS
[saxpy task ispc]:      [5.400] ms      [55.192] GB/s   [7.408] GFLOPS
                                (0.97x speedup from use of tasks)
```



可以看到，经过单核向量化加速的代码，经过向量化并利用多核进行并行的代码，原始串行代码。三个不同的实现最后的运行速度几乎一模一样。



产生这个现象的原因已经间接的在运行输出中给出了。可以看到，三个代码计算出的访存带宽相近。使用 AID64 测试本机的内存读写速度，可以看到，程序输出的简单计算得到的内存读取带宽略小于实际内存带宽。我们有一个简单的计算公式 $$\frac{访存数据量}{访存时间} = 内存读带宽$$，由于示例程序 将程序运行时间近似访存时间，所以导致估计的访存时间偏大，内存读带宽计算结果偏小。

此外，通过这个公式结合已知的内存读带宽的数值，还能够计算出该程序访存消耗的时间约为 5ms，占到了程序总执行时间的 90% 以上。

![运行平台内存性能数据](./images/index/CS149-Assign1!%20Analyzing%20Parallel%20Program%20Performance%20on%20a%20Quad-Core%20CPU-image.png)

### 内存带宽的计算公式



---

## Program 6: K-Means 聚类并行化（真实算法的性能分析与优化）

前面我们学习了多线程、SIMD、ISPC 等并行技术。现在我们将这些技术应用到**真实算法**——K-Means 聚类，学习如何分析性能瓶颈并进行优化。

### 本地数据集生成

你可以在 `main.cpp` 中找到以下生成本地数据集的代码，将 `readData()` 函数先注释掉，然后将用 ”/\*“ 注释掉的部分还原成下面这样。此时保存后重新编译然后运行一次程序，就能够发现当前文件夹下多了一个名字为 `data.dat` 的文件，就是本地生成的数据集。

然后请将代码还原回本节一开始的样子，即从本地 `./data.dat` 文件中读取的代码逻辑。

```c++
  // NOTE: we will grade your submission using the data in data.dat
  // which is read by this function
  // readData("./data.dat", &data, &clusterCentroids, &clusterAssignments, &M, &N,
           &K, &epsilon);

  // NOTE: if you want to generate your own data (for fun), you can use the
  // below code
  
  M = 1e6;
  N = 100;
  K = 3;
  epsilon = 0.1;

  data = new double[M * N];
  clusterCentroids = new double[K * N];
  clusterAssignments = new int[M];

  // Initialize data
  initData(data, M, N);
  initCentroids(clusterCentroids, K, N);

  // Initialize cluster assignments
  for (int m = 0; m < M; m++) {
    double minDist = 1e30;
    int bestAssignment = -1;
    for (int k = 0; k < K; k++) {
      double d = dist(&data[m * N], &clusterCentroids[k * N], N);
      if (d < minDist) {
        minDist = d;
        bestAssignment = k;
      }
    }
    clusterAssignments[m] = bestAssignment;
  }

  // Uncomment to generate data file
  writeData("./data.dat", data, clusterCentroids, clusterAssignments, &M, &N,
             &K, &epsilon);
  
```

### 在程序计算部分添加计时代码

直接在 文件 `kmeansThread.cpp` 文件中找到K-Means算法的主要部分：

```cpp

  /* Main K-Means Algorithm Loop */
  int iter = 0;
  while (!stoppingConditionMet(prevCost, currCost, epsilon, K)) {
    // Update cost arrays (for checking convergence criteria)
    for (int k = 0; k < K; k++) {
      prevCost[k] = currCost[k];
    }

    // Setup args struct
    args.start = 0;
    args.end = K;

    computeAssignments(&args);
    computeCentroids(&args);
    computeCost(&args);

    iter++;
  }
```

然后仿照 prog1 ，在每个 `computeXXX()` 函数前后插入如下的计时打印代码：

```c++

  /* 主要的K-Means算法循环 */
  int iter = 0;
  while (!stoppingConditionMet(prevCost, currCost, epsilon, K)) {
    // 更新成本数组（用于检查收敛条件）
    for (int k = 0; k < K; k++) {
      prevCost[k] = currCost[k];
    }

    // 设置args结构体
    args.start = 0;
    args.end = K;

    double start_time1 = CycleTimer::currentSeconds();
    computeAssignments(&args);
    double end_time1 = CycleTimer::currentSeconds();
    printf("computeAssignments 消耗时间:%f\n",end_time1 - start_time1);
    
    double start_time2 = CycleTimer::currentSeconds();
    computeCentroids(&args);
    double end_time2 = CycleTimer::currentSeconds();
    printf("computeCentroids 消耗时间:%f\n",end_time2 - start_time2);
    
    double start_time3 = CycleTimer::currentSeconds();
    computeCost(&args);
    double end_time3 = CycleTimer::currentSeconds();
    printf("computeCost 消耗时间:%f\n",end_time3 - start_time3);

    iter++;
  }
```

然后运行程序就能够获取每个计算步骤在每次循环中消耗的时间了。

### 分析程序性能瓶颈

运行代码，得到如下运行反馈：

```bash
$./kmeans                                               
Reading data.dat...
Running K-means with: M=1000000, N=100, K=3, epsilon=0.100000
computeAssignments 消耗时间:0.250118
computeCentroids 消耗时间:0.030696
computeCost 消耗时间:0.031362
computeAssignments 消耗时间:0.126088
computeCentroids 消耗时间:0.026765
computeCost 消耗时间:0.029520
computeAssignments 消耗时间:0.110227
computeCentroids 消耗时间:0.026108
computeCost 消耗时间:0.029875
computeAssignments 消耗时间:0.108791
computeCentroids 消耗时间:0.024985
computeCost 消耗时间:0.028725
computeAssignments 消耗时间:0.104763
computeCentroids 消耗时间:0.025687
computeCost 消耗时间:0.032420
computeAssignments 消耗时间:0.102706
computeCentroids 消耗时间:0.025458
computeCost 消耗时间:0.027899
computeAssignments 消耗时间:0.097025
computeCentroids 消耗时间:0.021671
computeCost 消耗时间:0.025387
computeAssignments 消耗时间:0.093546
computeCentroids 消耗时间:0.021895
```

从以上数据中可以发现，函数 `computeAssignments()` 的消耗时间占每次迭代的所有计算的 三分之二 。所以我着手从`computeAssignments()` 函数开始分析。

```c++
/**
 * 将每个数据点分配到其"最近的"聚类中心。
 */
void computeAssignments(WorkerArgs *const args) {
  double *minDist = new double[args->M];    // O(1)
  
  // 初始化数组    O(M * 5) = O(M)
  for (int m =0; m < args->M; m++) {        // O(3)         
    minDist[m] = 1e30;  // 初始化每个点的距离为无穷大 //O(1)
    args->clusterAssignments[m] = -1;   // 用 -1 代表这时候每个点都没有找到聚类中心 O(1)
  }

  // 将数据点分配到最近的聚类中心 O(
  for (int k = args->start; k < args->end; k++) {    // O(3)
    // 获取所有数据点到某个聚类中心的距离的最小值    O( M * （3 + N) ) = O(M * N)
    for (int m = 0; m < args->M; m++) {            // O(3)
      double d = dist(&args->data[m * args->N],    // O(N)        
                      &args->clusterCentroids[k * args->N], args->N);
      if (d < minDist[m]) {    //O(2)
        minDist[m] = d;    // O(1)
        args->clusterAssignments[m] = k; // O(1) 
      }
    }
  }

  free(minDist);
}

```

---

## 未来改进（TODO）

本文作为作业完成过程的记录，部分内容尚未完成。以下为未来改进计划：

### Program 1
- [ ] **任务 4**：实现按行交错分配任务的方式（round-robin scheduling），以均衡工作负载
- [ ] **任务 5**：使用16个线程运行改进后的代码，分析性能是否优于8线程

### Program 2
- [ ] **示例代码 `absVec()` 分析**：补充说明为什么该代码不能正确处理所有输入

### Program 4
- [ ] **AVX2 内联函数**：手动使用 Intel 内联函数编写向量化代码

### Program 5
- [ ] **性能数据解读**：添加关键发现总结，明确指出 SAXPY 是 memory-bound 程序
- [ ] **内存带宽公式**：补充完整的带宽计算公式和推导过程

### Program 2
- [ ] **图片图例**：为4张向量利用率图片添加配置说明（Vector Width 2/4/8/16）



## 发布记录
| 日期       | 版本 | 更新说明 |
| ---------- | ---- | -------- |
| 2026-01-27 | 1.0  | 初版发布 |



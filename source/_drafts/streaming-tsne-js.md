---
title: streaming-tsne-js
tags:
---

Design decisions
- Sparse KNN approximation of P
  - Use vantage point tree to perform KNN queries
    - Use an existing library, fpirsch/vptree.js
  - Store P in nested objects (hash tables)
    - alternative of "compressed sparse row" (CSC) format, which van der Maaten uses
      - makes symmetrizing the matrix more tricky
    - constant time set and get
    - but poor constant time performance, only worth it since it is sparse
    - easier to use/implement than other sparse matrix representations
    - Store a 2D array of the indices of the nonzero elements in P for fast looping
      - `Object.keys(P).forEach` and `for .. in` both much slower than raw `for` loop
  - Symmetrize P on demand
    - Suggested by Pezzotti 2015 (A-tSNE paper) but not explained very clearly
    - Push the computation down from the initialization into the gradient step
    - Instead of computing the symmetric form of Pij during initialization, compute $P_{ij} = \frac{P_{j|i} + P_{i|j}}{2N}$ whenever we need $P_{ij}$ in the gradient step.
    - Avoids the overhead of keeping P symmetric as we add more points, so makes more sense when data is continuously coming in (while precomputing makes more sense when the data is static)
- Use Barnes-Hut approximation for Q
  - No existing library in JavaScript that worked out of the box
  - Decided to stick with 2D (quadtree) for simplicity, but not hard to generalize
  - Adapted the implementation in arbor.js (samizdatco/arbor)
  - Had to be rewritten to correctly handle:
    - counting points rather than mass
    - bugs in the computation of the center of mass
    - computing the Frep term in the t-SNE gradient rather than magnetic repulsion
  - Existing optimizations:
    - reusing node objects to prevent "gc horroshow"
    - iterative breadth-first search rather than depth-first search, avoid too many function calls
  - New optimizations:
    - move var declarations to the top of the functions (1.5-2x? speedup for computeForces)
    - Create and set the members of the node objects (Cell) in one place to make use of the "hidden class" optimization in V8 (https://www.html5rocks.com/en/tutorials/speed/v8/) (marginal 1.1x? speedup)
- Mathematical computation in JavaScript
- For multidimensional arrays, use contiguous typed arrays with stride-indexing
  - Use scijs/ndarray to provide a simple view around these arrays
  - Use simple for loops for elementwise operations
- Further JavaScript/d3/Web optimizations
  - Use `var` rather than `let` and `const`, which are not well supported by the V8 optimizing compiler
  - Use `requestAnimationFrame` rather than `setInterval`
  - Avoid data `enter()`s in d3 unless necessary
  - ?
  - Future work: offload computation to WebWorkers for responsiveness??
- Gradient descent
  - use early exaggeration
  - momentum update with parameter $\alpha$
  - compute gain as `Math.max(sign(gradid) === sign(stepid) ? gainid * 0.8 : gainid + 0.2, 0.01)` as per Karpathy [not sure where this is from and why this works, @rajpurkar?]
- Parameter tuning
  - Configurable:
    - perplexity $u$: van der Maaten suggested 30 for original t-SNE (2008) and 50 for Barnes-Hut (2014)
    - number of neighbors $k$: $\lceil 3u \rceil$ suggested by van der Maaten (2014)
    - $\theta$ Barnes-Hut accuracy parameter: 0.5 works pretty well empirical, can tune it a bit higher (I've tried as high as 0.8) for better performance, but the embedding is a little less stable
    - learning rate: 10
  - Early exaggeration: `Math.max(8 - 0.4 * Math.sqrt(this.iter), 0.2)` [TODO(rajpurkar) explain?]
  - $\alpha = 0.5$ before 250 iterations and $\alpha = 0.8$ after (van der Maaten 2014)
- Extension for streaming (adding points)
  - Expose an additional `add` API
  - When a point $x_a$ comes in
    - Look up KNNs of $x_a$ in vantage-point tree
      - note that since we aren't adding new points into the vantage point tree, the quality of this query will begin the degrade
    - for every $x_i$:
      - Replace the farthest neighbor of $x_i$ if $$d(x_a, x_i) &lt; d_i^{max}$$.
        - dmax (and its corresponding argmax) are cached
      - Compute $P_{a|i}$
        - Use cached value of the normalization factor, which will become less accurate over time as well
  - We skip:
    - Recomputing dmax
    - Recomputing $P_{j|i}$ for affected points (search for new kernel bandwidth sigma and normalize)
    - Adding $x_a$ to the vantage point tree
  - The correctness of the embedding will degrade over time because $P$ will start to become non-uniform, and the KNNs will become less and less accurate since $d_i^{max}$ is not recomputed
    - however empirically the quality is OK up to a certain number of points
  - When we have doubled the original amount of data, the vantage point tree is rebuilt and the input similarities recomputed
  - Lower momentum?? for another 100 iterations [TODO(rajpurkar): why? shouldn't we increase early exaggeration instead?]


Future work [anything we actually want to implement today?]:
- Properly support addition of points into the vantage-point tree
- Support removal of points from the embedding
- Create API for connecting to live stream of data (e.g. someone can watch for outliers!)
- Derive an error bound for our approximation
- Allow custom visualization of points
- A-tSNE ideas:
  - Why do they use forest of randomized kd trees?
  - Select points to recompute/fix their input similarities to improve embedding degradation of points that you are interested in
  - Implement a work queue for things that need to be recomputed
- Implement reservoir sampling for a high throughput stream
- Offload computation to WebWorkers


# Additional Experiments to Run

Other datasets:
- PCA'd MNIST
- would be cool to have streaming sensor data...


# Mars Land - Max Profit Simulator

An interactive simulation, mathematical solver, and timeline visualizer for the **Max Profit Problem** (Ever Quint Interview Assignment) in Mars Land, built with React 19, TypeScript, Vite, and Tailwind CSS.

## 🚀 Live Demo & Repository
- **GitHub Repository**: [akashBv6680/EQMaXprofit](https://github.com/akashBv6680/EQMaXprofit)
- **GitHub Pages**: [https://akashbv6680.github.io/EQMaXprofit/](https://akashbv6680.github.io/EQMaXprofit/)

---

## 📖 The Problem Statement

Mr. X owns a large strip of land in Mars Land with infinite land capacity. On each parcel of land he can choose to develop properties sequentially. He cannot have two properties being developed in parallel at any given unit of time.

### Available Establishments
| Establishment | Build Time | Land Parcel | Earnings / Unit Operational | Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Theatre (T)** | 5 units | 2x1 | $1,500 / unit | 8 Auditoriums |
| **Pub (P)** | 4 units | 1x1 | $1,000 / unit | 1 Dance Floor |
| **Commercial Park (C)** | 10 units | 3x1 | $2,000 / unit | 6 Commercial Spaces |

- After $n$ units of time (input), he earns money based on properties that are completed and operational.
- Output format: `T: <count> P: <count> C: <count>`.

---

## 🎯 Test Cases Verification

| Test Case | Input ($n$) | Expected Max Earnings | Optimal Solutions |
| :--- | :--- | :--- | :--- |
| **Test Case 1** | $n = 7$ | **$3,000** | 1. `T: 1 P: 0 C: 0`<br>2. `T: 0 P: 1 C: 0` |
| **Test Case 2** | $n = 8$ | **$4,500** | 1. `T: 1 P: 0 C: 0` |
| **Test Case 3** | $n = 13$ | **$16,500** | 1. `T: 2 P: 0 C: 0` |

---

## 🧮 Mathematical Proof (Smith's Scheduling Rule)

Why does construction order matter?

Suppose two jobs $A$ (build time $t_A$, rate $r_A$) and $B$ (build time $t_B$, rate $r_B$) are built consecutively starting at time $S$:
- **$A$ then $B$**: $\text{Earnings} = (n - S - t_A)r_A + (n - S - t_A - t_B)r_B$
- **$B$ then $A$**: $\text{Earnings} = (n - S - t_B)r_B + (n - S - t_B - t_A)r_A$
- **Difference**: $t_B r_A - t_A r_B = t_A t_B \left( \frac{r_A}{t_A} - \frac{r_B}{t_B} \right)$

Therefore, to maximize total revenue, properties must **strictly be scheduled in decreasing order of their efficiency ratio $\frac{r}{t}$**:
1. **Theatre (T)**: $\frac{1500}{5} = \mathbf{300} \text{ \$/unit}$
2. **Pub (P)**: $\frac{1000}{4} = \mathbf{250} \text{ \$/unit}$
3. **Commercial Park (C)**: $\frac{2000}{10} = \mathbf{200} \text{ \$/unit}$

Hence, any optimal set of buildings will **always** schedule all Theatres first, then all Pubs, then all Commercial Parks.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## 📜 License
Apache-2.0

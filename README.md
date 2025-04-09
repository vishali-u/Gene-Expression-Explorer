## Explore Differential Gene Expression
This web application is designed to visualize differential gene expression data uploaded in .csv or .tsv format by the user. It provides two main views:
* Table View: Displays differentially expressed genes in an interactive table. Supports filtering by gene name and sorting by columns
* Plot View: Displays differentially expressed genes in an interactive volcano plot.

## Data
Input data is expected in .csv or .tsv format. Columns required are GeneName, logFC, F, PValue, and FDR. \
An example dataset is available here: [example_data](https://drive.google.com/file/d/1DJCb1oo0HBwpzwLZsNSoXH0uH8OBQtFu/view?usp=drive_link)

## Technologies Used:
* Next.js
* React
* Plotly
* SQLite
* Tailwind CSS

## Getting Started
Make sure you have the following installed:
* Node.js
* npm

1. Clone the repository
```
git clone https://github.com/vishali-u/Gene-Expression-Explorer
cd Gene-Expression-Explorer
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


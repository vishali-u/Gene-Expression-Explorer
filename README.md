## Explore Differential Gene Expression
This web application is designed to visualize differential gene expression data uploaded in .csv or .tsv format by the user. It provides two main views:
* Table View: Displays differentially expressed genes in an interactive table. Supports filtering by gene name and sorting by columns
   * [Table Screenshot](https://drive.google.com/file/d/1UocY5uU6pFZgyDjurGxLCZ061FHcSX86/view?usp=drive_link) 
* Plot View: Displays differentially expressed genes in an interactive volcano plot.
   * [Plot Screenshot](https://drive.google.com/file/d/13okvNfmA0Bq3I81Nd3DMmaHt8zx9IU7X/view?usp=drive_link)



## Data
Counts data and metadata are expected in .csv or .tsv format.

## Technologies Used:
* Next.js
* React
* Plotly
* PostgreSQL
* Tailwind CSS
* R-integration

## Access the app via Docker
Make sure you have the following installed:
* Docker

1. Clone the repository:
```
git clone https://github.com/vishali-u/Gene-Expression-Explorer
cd Gene-Expression-Explorer
```

2. Build the Docker image:

```bash
docker build -t gene-expression-explorer .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 gene-expression-explorer
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


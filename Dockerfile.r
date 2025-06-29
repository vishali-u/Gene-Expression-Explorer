# Dockerfile.r
FROM rocker/r-ver:4.3.1

RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    zlib1g-dev \
    libz-dev \
    libbz2-dev \
    liblzma-dev \
    libpcre2-dev \
    libpng-dev \
    libjpeg-dev \
    libtiff-dev \
    libreadline-dev \
    && apt-get clean

# Install base R packages
RUN R -e "if (!requireNamespace('plumber', quietly=TRUE)) install.packages('plumber'); \
          if (!requireNamespace('readr', quietly=TRUE)) install.packages('readr'); \
          if (!requireNamespace('dplyr', quietly=TRUE)) install.packages('dplyr'); \
          if (!requireNamespace('tidyverse', quietly=TRUE)) install.packages('tidyverse'); \
          if (!requireNamespace('BiocManager', quietly=TRUE)) install.packages('BiocManager'); \
          if (!requireNamespace('DESeq2', quietly=TRUE)) BiocManager::install('DESeq2', ask=FALSE)"

WORKDIR /app/r-scripts

COPY r-scripts /app/r-scripts

CMD ["R", "-e", "pr <- plumber::plumb('plumber.R'); pr$run(host='0.0.0.0', port=8000)"]


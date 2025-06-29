library(plumber)
source("runDGE.R")

#* @post /run-dge
function(req, res) {
  params <- jsonlite::fromJSON(req$postBody)
  
  tryCatch({
    do.call(runDGE, params)
    list(status = "success")
  }, error = function(e) {
    res$status <- 500
    list(status = "error", message = e$message)
  })
}

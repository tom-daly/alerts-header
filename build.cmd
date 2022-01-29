cls

call gulp clean

REM call gulp build --ship

call gulp bundle --ship

call gulp package-solution --ship

call explorer .\sharepoint\solution\

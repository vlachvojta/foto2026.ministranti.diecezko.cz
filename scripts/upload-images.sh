#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# if less than 2 arguments are provided, exit
if [ "$#" -lt 2 ]; then
   echo "Usage: $0 <source_folder> <destination_folder>"
   exit 1
fi

# Assign command line arguments to variables, with default values if not provided
source_folder=${1:-"../tmp/vonka"}
destination_folder=${2:-"../foto/vonka"}

# if package.json does not exist in current directory, exit
if [ ! -f "package.json" ]; then
   echo -e "${RED}package.json not found in current directory. Please run this script from scripts/ folder.${NC}"
   exit 1
fi

yarn

# Check if source folder exists
if [ ! -d "$source_folder" ]; then
   echo "Source folder does not exist."
   exit 1
fi

# Check if destination folder exists, if not, create it
if [ ! -d "$destination_folder" ]; then
   mkdir -p "$destination_folder"
fi

# Loop through each file in the source folder
for file in "$source_folder"/*; do
   # Check if the item is a file
   if [ -f "$file" ]; then
      # Extract the file name from the full path
      file_name=$(basename "$file")

      # Extract the name without extension
      file_stem="${file_name%.*}"

      #if file exists in destination folder, skip
      if [ -f "$destination_folder/$file_stem".* ]; then
         echo -e "${RED}File already exists: $file_name${NC}"
         continue
      fi
      # exit 0

      # Copy the file to the destination folder
      cp "$file" "$destination_folder/$file_name"

      echo -e "${GREEN}Copied: $file_name${NC}"

      # Generate files
      rm -f "${destination_folder}/images.json"
      yarn gallery
      yarn img2webp "$destination_folder/$file_name"

      rm "$destination_folder/$file_name"

      # Commit changes
      # git add ../foto/*
      # git commit -m "Add image $file"
      # git pull
      # git push

      echo -e "${YELLOW}Image has been commited${NC}"
      echo ""
   fi
done

echo "Copy process completed."
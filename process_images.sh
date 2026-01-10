#!/bin/bash

cd "/Users/edsonfelix/Documents/Freelas/banda/public/img/banner/"

# Create a temporary directory for processed images
mkdir -p ./temp_processed

# Counter for new filenames
counter=1

# Process each jpg file
for file in statecycle_*.jpg; do
    if [ -f "$file" ]; then
        # Use sips to:
        # -Z 1920: max dimension 1920px (maintains aspect ratio)
        # -s format jpeg: ensure JPEG format
        # -s formatOptions 75: JPEG quality at 75% (good balance of size/quality)
        output_file="./temp_processed/banner${counter}.jpg"
        
        sips -Z 1920 -s format jpeg -s formatOptions 75 "$file" --out "$output_file" 2>/dev/null
        
        # Show progress
        original_size=$(ls -lh "$file" | awk '{print $5}')
        new_size=$(ls -lh "$output_file" | awk '{print $5}')
        echo "✓ $counter: $file ($original_size) → banner${counter}.jpg ($new_size)"
        
        ((counter++))
    fi
done

echo ""
echo "Calculando economia de espaço..."
original_total=$(du -sh . | awk '{print $1}')
new_total=$(du -sh ./temp_processed | awk '{print $1}')

echo "Original: $original_total"
echo "Otimizado: $new_total"
echo ""
echo "Próximo passo: mv ./temp_processed/* . && rm -rf ./temp_processed"

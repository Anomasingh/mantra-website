# Script to fix JSON structure in wordtoword files
$rootPath = "c:\Users\anoma\OneDrive\Desktop\mantra data final\json formatted lyrics\ab to final hi hoga"
$files = Get-ChildItem -Path $rootPath -Recurse -File | Where-Object { $_.Name -like "*wordtoword*" }

$totalFiles = $files.Count
$fixedFiles = 0
$errorFiles = 0

Write-Host "Found $totalFiles wordtoword files to process..."

for ($i = 0; $i -lt $files.Count; $i++) {
    $file = $files[$i]
    $progress = [math]::Round(($i / $totalFiles) * 100, 1)
    Write-Host "[$progress%] Processing: $($file.Name) in $($file.Directory.Name)"
    
    try {
        # Read the file content
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $needsUpdate = $false
        $newStructure = $null
        
        # Check if it starts with [ (bare array)
        if ($content.Trim().StartsWith("[")) {
            Write-Host "  -> Converting bare array to object"
            $jsonArray = $content | ConvertFrom-Json
            $newStructure = @{ lines = $jsonArray }
            $needsUpdate = $true
        }
        # Check if it's an object
        elseif ($content.Trim().StartsWith("{")) {
            $jsonData = $content | ConvertFrom-Json
            
            # Check if it has 'lines' property with nested 'value'
            if ($jsonData.PSObject.Properties['lines'] -and $jsonData.lines.PSObject.Properties['value']) {
                Write-Host "  -> Fixing nested value structure"
                $newStructure = @{ lines = $jsonData.lines.value }
                $needsUpdate = $true
            }
            # Check if it has other properties but no 'lines'
            elseif (-not $jsonData.PSObject.Properties['lines']) {
                Write-Host "  -> Converting to lines structure"
                # Find the array property
                $arrayProperty = $null
                foreach ($prop in $jsonData.PSObject.Properties) {
                    if ($prop.Value -is [Array]) {
                        $arrayProperty = $prop.Value
                        break
                    }
                }
                if ($arrayProperty) {
                    $newStructure = @{ lines = $arrayProperty }
                    $needsUpdate = $true
                }
            }
            # Check if it already has correct structure
            elseif ($jsonData.PSObject.Properties['lines'] -and $jsonData.lines -is [Array]) {
                Write-Host "  -> Already correct structure"
            }
        }
        
        # Update the file if needed
        if ($needsUpdate -and $newStructure) {
            $newJson = $newStructure | ConvertTo-Json -Depth 10
            $newJson | Set-Content -Path $file.FullName -Encoding UTF8
            $fixedFiles++
            Write-Host "  -> Fixed successfully"
        }
        
    } catch {
        Write-Host "  -> ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errorFiles++
    }
}

Write-Host "`n=== SUMMARY ==="
Write-Host "Total files processed: $totalFiles"
Write-Host "Files fixed: $fixedFiles"
Write-Host "Errors: $errorFiles"
Write-Host "Files already correct: $($totalFiles - $fixedFiles - $errorFiles)"

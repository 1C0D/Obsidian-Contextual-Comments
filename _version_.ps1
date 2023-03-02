param (
    [Parameter(Mandatory=$true)]
    [string]$NewVersion
)

# update manifest.json
$manifest = Get-Content manifest.json
$manifest = $manifest -replace '(?<="version": ")[^"]+', $NewVersion
$manifest | Set-Content manifest.json

# update package.json
$manifest = Get-Content package.json
$manifest = $manifest -replace '(?<="version": ")[^"]+', $NewVersion
$manifest | Set-Content package.json

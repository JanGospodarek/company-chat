# Function to display a numbered list of folders in the current directory
display_folders() {
    local count=0
    for folder in */; do
        ((count++))
        echo "$count. ${folder%/}"
    done
}

# Main script
cd /backup/data

if [ -z "$(ls -A)" ]; then
    echo "No backups available"
    exit 1
fi

echo "Available backups:"
display_folders

# Prompt the user to select a folder
read -p "Enter the number of the folder you want to select: " selection

# Validate the selection
if ! [[ $selection =~ ^[0-9]+$ ]]; then
    echo "Error: Please enter a valid number."
    exit 1
fi

# Get the selected folder name
selected_folder=$(ls -d */ | sed -n "${selection}p" | sed 's#/##')

# Check if the selected folder exists
if [ -d "$selected_folder" ]; then
    echo "You selected: $selected_folder"
    # Add your further operations here with the selected folder
else
    echo "Error: Invalid selection."
fi

cd $selected_folder

# Clear database before restore
psql -h db -d miau -U postgres -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Restore database from backup
psql -h db -d miau -U postgres -q < db/miau.sql


# Restore uploads from backup
tar --touch --no-same-owner --no-same-permissions -xzf content/content.tar.gz -C /


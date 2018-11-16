#!/bin/bash
echo "Type your commit message"
read COMMIT_MESSAGE

# Add all files to be commited
git add -A

# Get all the changed files
CHANGED_FILES=$({ git diff --name-only ; git diff --name-only --staged ; } | sort | uniq)

for FILE in $CHANGED_FILES
do
    curl -u 332540:CASftp001 "sftp://sftp.caswognum.nl/public/sites/www.caswognum.nl/" --upload-file "$FILE" -k
done

BRANCH_NAME = $(git branch | grep \* | cut -d ' ' -f2)

git commit -m "$COMMIT_MESSAGE"
git push origin $BRANCH_NAME

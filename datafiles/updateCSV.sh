#!/bin/bash

while [ 1 ];
do
	#remove oldestDate
	oldestDate=$(sed -n '22p' squat.csv)
	sed -i "s/$oldestDate//g" squat.csv  



	##### Most recent entry
	mostRecentEntry=$(sed -n '2p' squat.csv)
	recentDate=${mostRecentEntry%,*}
	newCount=${mostRecentEntry#*,}


	################ create newly generated date ##########################
	newDateValue=$(date --date="$recentDate" "+%d-%b-%y")
	newGeneratedDate=$(date -d "$newDateValue+1 day")
	newGeneratedDateFormat=$(date --date="$newGeneratedDate" "+%d-%b-%y")
	########################################################################

	## parse decimal
	bigend=${newCount%.*}
	smallend=${newCount#*.}


	random=$(shuf -i 1-600 -n 1)
	newGeneratedCount="$random.$smallend"

	### FULLLY GENERATED ENTRY, DATE & COUNT
	newGeneratedEntry="$newGeneratedDateFormat,$newGeneratedCount"

	### Insert new entry at top position(most recent)
	sed -i "s/$recentDate/$newGeneratedEntry\n$recentDate/g" squat.csv  


	#### clean up newlines at end

	sed -i '/^$/d' squat.csv

	##sleep timer
	sleep 5
done
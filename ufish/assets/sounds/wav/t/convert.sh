OIFS="$IFS"
IFS=$'\n'
ext=wav
for i in  *.wav 
#for file in `find . -type f -name "*.mp4"`  
do
     echo "file = ${i%.$ext}.mp3"
	ffmpeg -i "$i" "${i%.$ext}.mp3" && echo DONE
done
IFS="$OIFS"

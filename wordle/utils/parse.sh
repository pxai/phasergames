for i in `cat fr.js`
do  
len=`echo "${i}"|wc -c`
if [ $len -eq 6 ] 
then
    echo $i
fi
done
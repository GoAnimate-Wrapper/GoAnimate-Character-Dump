$d=1
$c=328489993
cd "C:\Users\( USERNAME )\Documents\GitHub\GoAnimate Characters"
for(;$c-gt0;$c=$c-$d){$r=(Invoke-WebRequest -Uri "https://ga.vyond.com/goapi/getCcCharCompositionXml/" -Method "POST" -Body "assetId=$c").Content;if($r[0]-eq'0'){$r.Substring(1) | Out-File "$c.xml".PadLeft(13,'0')};}
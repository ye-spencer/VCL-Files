SELECT R."selected", COUNT(*)
FROM "whichToolYouPick" AS R 
WHERE R."prolificId" !='X'
GROUP BY R."selected"
ORDER BY COUNT(*) DESC
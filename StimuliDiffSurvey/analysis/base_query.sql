-- This was ran in an environment where the tables were directly accessable

SELECT question_id, AVG(score) AS average_agreement
FROM survey_responses_sds
WHERE survey_responses_sds.prolific_id != 'TEST OR UNKNOWN'
GROUP BY survey_responses_sds.question_id

-- Results
-- question_id,average_agreement
-- human_dog_smell, 21.2428067535907
-- threshold_jnd, 74.0429096917808
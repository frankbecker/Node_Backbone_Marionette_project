select 
p.id, 
p.project_title,
f.filename,
CONCAT(r.name_first, ' ', r.name_last) AS 'researcher',
t.table_name

from projects p
left join project_researchers pr on p.id = pr.project_id
left join researchers r on pr.researcher_id = r.id
left join files f on f.project_id = p.id
left join file_tables ft on ft.file_id = f.id
left join tables t on ft.table_id = t.id
;
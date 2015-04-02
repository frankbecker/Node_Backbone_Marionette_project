Select 
t.id, 
t.table_name,
t.description,
f.field_name, 
f.id as field_id,
fl.id as file_id,
fl.filename,
fl.path,
p.project_title, 
p.id as project_id,
concat(r.name_first, " ", r.name_last) as researcher,
r.id as researcher_id 
from tables t
left join fields f on t.id = f.table_id
left join file_tables ft on ft.table_id = t.id
left join files fl on fl.id = ft.file_id
left join projects p on p.id = fl.project_id
left join project_researchers pr on pr.project_id = p.id
left join researchers r on r.id = pr.researcher_id
where t.id = ?
;
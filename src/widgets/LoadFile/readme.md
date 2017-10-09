Обновлённое API для генерации артефактов

https://repo.re-ports.ru/api/Model (?)

http://repo.re-ports.ru:8080/ModelApi
JSON-массив с вариантами для modelArtifact

http://repo.re-ports.ru:8080/ArtifactApi?modelArtifac..
создать новый артефакт, с указанной моделью данных

http://repo.re-ports.ru:8080/ArtifactApi?objId=obj_50..
пересоздать уже существующий артефакт, с кодом obj_50001

http://repo.re-ports.ru:8080/ArtifactApi
посмотреть JSON-объект с текущим состоянием сборки артефактов. Примерный вид:
{ 
obj_50001: { 
objId: "obj_50001", 
modelArtifact: "Firebird", 
zipPath: "/tmp/mvnTempDir_85133zrhDnx2uajP/obj_50001/target/client_obj_50001.zip", 
ready: true 
}, 
obj_500002: { 
objId: "obj_500002", 
modelArtifact: "Firebird", 
zipPath: "/tmp/mvnTempDir_85133zrhDnx2uajP/obj_500002/target/client_obj_500002.zip", 
ready: true 
}, 
obj_500003: { 
objId: "obj_500003", 
modelArtifact: "MS-SQL", 
zipPath: null, 
ready: false 
} 
}

http://repo.re-ports.ru:8080/ArtifactApi?objId=obj_50.. - ссылка на закачку артефакта obj_500001
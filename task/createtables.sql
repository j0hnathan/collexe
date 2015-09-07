CREATE TABLE taskhdr (
taskid bigint not null AUTO_INCREMENT,
taskname nvarchar(30) not null,
taskdesc nvarchar(200) not null,
taskdate datetime,
projectid bigint,
assigneduser bigint,
createdby bigint,
createdon datetime,
PRIMARY KEY (taskid)
)

CREATE TABLE tasktimer (
tasktimerid bigint not null AUTO_INCREMENT,
taskid bigint not null,
jobdate datetime,
lat decimal(10,6),
lng decimal(10,6),
startjob datetime,
endjob datetime,
createdby bigint,
createdon datetime,
PRIMARY KEY (tasktimerid)
)

CREATE TABLE projecthdr (
projectid bigint not null AUTO_INCREMENT,
projectname nvarchar(20) not null,
projectdesc nvarchar(200) not null,
location nvarchar(100),
createdon bigint,
createdby datetime,
PRIMARY KEY (projectid)
)

CREATE TABLE user (
userid bigint not null AUTO_INCREMENT,
username nvarchar(20) not null,
password char(32) not null,
createdby bigint,
createdon datetime,
PRIMARY KEY (userid)
)

CREATE TABLE team (
teamid bigint not null AUTO_INCREMENT,
teamname nvarchar(20) not null,
teamlead bigint,
createdby bigint,
createdon datetime,
PRIMARY KEY (teamid)
)

CREATE TABLE teammatrix (
teammatrixid bigint not null AUTO_INCREMENT,
teamid bigint not null,
userid bigint not null,
createdby bigint,
createdon datetime,
PRIMARY KEY (teammatrixid)
)



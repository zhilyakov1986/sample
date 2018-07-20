FROM microsoft/dotnet-framework:4.6.2-windowsservercore-10.0.14393.953

EXPOSE 9001 

#The only reason for APIStart.bat is because currently Windows Containers cannot created named volumes on directorys with files inside
COPY APIStart.bat c:\\APIStart.bat

#Setting EntryPoint to a batch file to copy files from docsample to docs then run API.exe 
ENTRYPOINT ["APIStart.bat"]

COPY docs/ c:\\docssample

COPY bin/Production/ c:\\API

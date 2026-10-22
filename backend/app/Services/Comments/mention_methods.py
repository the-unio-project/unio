# <@mention>

from uuid import UUID

from sqlalchemy.orm import Session

from Repositories.project_repo import ProjectRepository
from Repositories import workspace_repo

def get_comment_mentions(comment:str, project_id:UUID, session:Session) -> list[UUID]:

    project_repo = ProjectRepository(session)

    project = project_repo.get_by_id(project_id)

    cycling = True

    ids:list[UUID] = []

    buffer:str = comment

    while cycling:
        (_, _, buffer) = buffer.partition("<@") # removes anything from the buffer before <@

        if not buffer or buffer == "":
            cycling = False
            continue

        (id, _, buffer) = buffer.partition(">") # gets the ID and the rest of the comment goes to the buffer

        try: 
            _ = workspace_repo.get_member(project.workspace_id, UUID(id), session) # will except if UUID isnt valid, if user isnt real, if workspace isnt real
            ids.append(UUID(id))

        except:
            continue

    return ids

# <@mention>

from uuid import UUID


def get_comment_mentions(comment:str):
    cycling = True

    ids:list[UUID] = []

    buffer:str = comment

    while cycling:
        (_, _, buffer) = buffer.partition("<@")

        if not buffer or buffer == "":
            cycling = False
            continue

        (id, _, buffer) = buffer.partition(">")

        try: # if not a valid uuid wont mention
            ids.append(UUID(id))
        except:
            continue

    return ids

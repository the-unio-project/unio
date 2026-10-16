from jarowinkler import jarowinkler_similarity

from Models.models import Task

def search_title(search_content:str, tasks:list[Task]) -> list[Task]:
    final_list:list[Task] = []

    for task in tasks:
        similarity = jarowinkler_similarity(search_content, task.title)

        if similarity < 0.85: # change value if searches are not showing relevant enough results
            continue
        else:
            final_list.append(task)

    return final_list

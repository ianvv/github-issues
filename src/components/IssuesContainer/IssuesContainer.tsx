import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import IssueItem from "../IssueItem/IssueItem";
import s from "./issuesContainer.module.scss";
import { IIssue } from "../../redux/commonDeclaration";

interface IIssuesContainerProps {
  arr: IIssue[];
  title: string;
}

const IssuesContainer: React.FC<IIssuesContainerProps> = ({ arr, title }) => {
  const [issues, updateIssues] = useState(arr);

  useEffect(() => {
    updateIssues(arr);
  }, [arr]);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(issues);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateIssues(items);
  };

  return (
    <div className={s.issuesContainer}>
      <h2>{title}</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <ul
              className="characters"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {issues.length < 1 ? (
                <h3>No issues yet...</h3>
              ) : (
                issues.map((issue, index) => {
                  return (
                    <Draggable
                      key={issue?.id}
                      draggableId={issue?.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <IssueItem issue={issue} />
                        </li>
                      )}
                    </Draggable>
                  );
                })
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default IssuesContainer;

import * as React from 'react'
import TodosForm from './TodosForm'
import TodoItem from './TodoItem'
import styled from 'styled-components'
import { MapState, MapDispatch } from './TodosContainer'

// ______________________________________________________
//
// @ Types

type Props = MapState & MapDispatch & { className?: string }

// ______________________________________________________
//
// @ View

const View = (props: Props) => (
  <div className={props.className}>
    <h1>{props.name}</h1>
    <p>{props.timeLabel}</p>
    <p>{props.todosCountStatusLabel}</p>
    <p>
      <button onClick={() => props.handleClickToggle()}>
        {props.toggleVisibleItemsBtnLabel}
      </button>
    </p>
    <TodosForm
      inputValue={props.inputValue}
      handleSubmit={props.handleSubmit}
      handleInputChange={props.handleInputChange}
    />
    {props.items.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        handleClickDone={props.handleClickDone}
      />
    ))}
  </div>
)

// ______________________________________________________
//
// @ StyledView

export default styled(View)`
  flex: 1 0 auto;
  margin: 10px 20px;
  padding: 20px;
  border-radius: 5px;
  border: 2px solid;
  background-color: ${props => props.styled.bg};
  > h1 {
    margin-bottom: 10px;
    font-size: 2rem;
    font-weight: bolder;
  }
  > p {
    margin-bottom: 10px;
  }
`

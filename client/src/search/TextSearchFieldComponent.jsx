import React from 'react'

const TextSearchField = ({onEnterKeyDown}) => {
  const handleSubmit = (e) => onEnterKeyDown(e.target.value);

  return <input
      hintText="Enter Search Term"
      fullWidth={true}
      onKeyDown={handleSubmit}
  />
}

export default TextSearchField

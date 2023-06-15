# Contextual Comments

(Adviced shortcuts <kbd>ctrl :</kbd> for Line comments, <kbd>shit alt a</kbd> for Block comments)
- Improved handling of normal comments `%%...%%`
- Toggle comments in code blocks (language related):  
  - Line comments e.g: `//....` or `#....`
      - if 1 line selected:
        - whole line, without selection, at cursor position.
        - from the beginning of the selection.
      - multiline selection:
        - whole lines 
          - e.g:
            ```   
            // this is first commented line  
            // this is second commented line
            ```
          - some language like html will be around selection (not by line), but whole lines selected    
              ```
              \<!-- this is first commented line       
              this is second commented line --\>
              ``` 
  - Block comments e.g: `/* ... */` or `<!-- ... -->`
    - if 1 more line(s) selected:
      - around selection   
          ```
          this /* is first commented line      
          this is second commented line */
          ```
    - Unlike Line comments, if there is no selection, you can create a new comment at cursor position (even on empty line)
<!-- -->
- Two commands to trim end lines: 
  - one for the whole document,     
  - one in code blocks only (the most useful).

(If you need more code block prefixes, feel free to ask on my GitHub. If I missed some, please let me know.)


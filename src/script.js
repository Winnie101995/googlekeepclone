//creat a class - (object) called App

class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [] ;
    this.title = "";
    this.text = "";
    this.id = "";

    // console.log('app works');
    //checking if notes sections of our app has been clciked
    //$ = HTML element and not data
    this.$placeholder = document.querySelector("#placeholder");
    this.$form = document.querySelector("#form");
    this.$notes = document.querySelector("#notes");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$formButtons = document.querySelector("#form-buttons");
    this.$formCloseButton = document.querySelector("#form-close-button");
    this.$modal = document.querySelector(".modal");
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalCloseButton = document.querySelector(".modal-close-button");
    this.$colorTooltip = document.querySelector("#color-tooltip");
    //we need to call render to display our intial notes
    this.render();
    this.addEventListeners();
  }
  //adding event listener to see for a click
  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener("mouseover", (event) => {
      this.openTooltip(event);
    });

    document.body.addEventListener("mouseout", (event) => {
      this.closeTooltip(event);
    });

    this.$colorTooltip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.$colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    //changes color of the colortool kit
    this.$colorTooltip.addEventListener("click", (event) => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
    });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        //add note
        //enables us to write the value of text and title ina ny order
        this.addNote({ title, text });
      }
    });

    this.$formCloseButton.addEventListener("click", (event) => {
      //stops event from proagating as there is a bug that prevents the form from closing
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener("click", (event) => {
      this.closeModal(event);
    //   console.log("it's closing!");
    });
  }

  handleFormClick(event) {
    //contains returns a tru or false
    const isFormClicked = this.$form.contains(event.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    if (isFormClicked) {
      //open form
      this.openForm();
    } else if (hasNote) {
      this.addNotes({ title, text });
    } else {
      //close the form
      this.closeForm();
    }
  }
  //fucntion to display content in the form
  openForm() {
    this.$form.classList.add(".form-open");
    this.$noteTitle.style.display = "block";
    this.$formButtons.style.display = "block";
  }

  closeForm() {
    this.$form.classList.remove(".form-open");
    this.$noteTitle.style.display = "none";
    this.$formButtons.style.display = "none";
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }

    openModal(event) {
        if (event.target.matches('.toolbar-delete')) return;
    if (event.target.closest(".note")) {
      this.$modal.classList.toggle("open-modal");
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {
      this.editNote();
      
    this.$modal.classList.toggle("open-modal");
  }

  openTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.id = event.target.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left;
    const vertical = window.scrollY - 20;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }

  closeTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.$colorTooltip.style.display = "none";
  }

  addNote({ title, text }) {
    //note data
    const newNote = {
      title,
      text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };

    this.notes = [...this.notes, newNote];
      this.render();
    this.closeForm();

    console.log(this.notes);
  }

  editNote() {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, title, text } : note
    );
      this.render();
  }

  editNoteColor(color) {
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, color } : note
    );
    this.render()
  }

  selectNote(event) {
    const $selectedNote = event.target.closest(".note");
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }
  
   
  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.render();
}
    
     
    //saving code use render()
    render() {
        this.saveNotes();
        this.displayNotes()
        
    }
//saving our notes onto the browswer - need to turn an object to string so use JSON.stringify
    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes))
    }
    
  displayNotes() {
    const hasNotes = this.notes.length > 0;
    //this.$placeholder.style.display = hasNotes? 'none' : 'flex';
    if (hasNotes) {
      this.$placeholder.style.display = "none";
    } else {
      this.$placeholder.style.display = "flex";
    }

    this.$notes.innerHTML = this.notes
      .map(
        (note) => `
        <div style="background: ${
          note.color
        };" class="note" data-id="{note.id}">
        <div class="${note.title && "note-title"}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
        <div class="toolbar">
        <i class="fas fa-palette toolbar-color" data-id=${note.id}></i>
        <i class="far fa-trash-alt toolbar-delete" data-id=${note.id}></i>
        </div>
        </div>
        </div>
        `
      )
      .join("");
    //.join(" ") stops the ' after each note
  }
}

new App();

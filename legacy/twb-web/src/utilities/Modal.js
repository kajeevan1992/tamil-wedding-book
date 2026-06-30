
export class Modal {
    constructor(el, options) {
        var self = this;

        this.el = document.querySelector(el);
        this.options = options;

        try {
            var list = document.querySelectorAll('#' + this.el.id + ' [data-dismiss="modal"]');
            for (var x = 0; x < list.length; x++) {
                list[x].addEventListener('click', function (e) {
                    if (e)
                        e.preventDefault();
                    self.hide();
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
    /**
         * Methods
         */
    show() {

        var self = this;
        // adding backdrop (transparent background) behind the modal
        if (self.options.backdrop) {
            var backdrop = document.getElementById('bs.backdrop');
            if (backdrop === null) {
                backdrop = document.createElement('div');
                backdrop.id = "bs.backdrop";
                backdrop.className = "modal-backdrop fade show";
                document.body.appendChild(backdrop);
            }
        }

        // show modal
        // this.el.classList.add('in');
        setTimeout(() => {
            this.el.classList.add('show');
        }, 100);
        this.el.style.display = 'block';
        document.body.classList.add('modal-open');
    }
    hide() {
        var self = this;
        // hide modal

        setTimeout(() => {
            this.el.classList.remove('show');
        }, 100);
        this.el.style.display = 'none';
        document.body.classList.remove('modal-open');

        // removing backdrop
        if (self.options.backdrop) {
            var backdrop = document.getElementById('bs.backdrop');
            if (backdrop !== null)
                document.body.removeChild(backdrop);
        }
    }
}
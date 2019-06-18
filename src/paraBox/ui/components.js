import Component from '../../web-component';

class ParaBox extends Component {}

ParaBox.template = `
  <section class='para-box'>
    <div class='para-box-body'>
      <slot></slot>
    </div>
  </section>
`;

ParaBox.style = '';

export default {
	ParaBox
};

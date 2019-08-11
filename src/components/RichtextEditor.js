import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'

import {initEditor, isTextarea, mergePlugins, uuid} from '../Utils';

const isTextarea = element => {
	return element !== null && element.tagName.toLowerCase() === 'textarea';
};

const renderInline = (h, id, tagName) => {
	return h(tagName ? tagName : 'div', {
		attrs: {id}
	});
};

const renderIframe = (h, id) => {
	return h('textarea', {
		attrs: {id},
		style: {visibility: 'hidden'}
	});
};


var initialise = function (ctx) {
	return function () {
		var finalInit = __assign({}, ctx.$props.init, {
			readonly: ctx.$props.disabled,
			selector: "#" + ctx.elementId,
			plugins: mergePlugins(ctx.$props.init && ctx.$props.init.plugins, ctx.$props.plugins),
			toolbar: ctx.$props.toolbar || (ctx.$props.init && ctx.$props.init.toolbar),
			inline: ctx.inlineEditor,
			setup: function (editor) {
				ctx.editor = editor;
				editor.on('init', function (e) {
					return initEditor(e, ctx, editor);
				});
				if (ctx.$props.init && typeof ctx.$props.init.setup === 'function') {
					ctx.$props.init.setup(editor);
				}
			}
		});
		if (isTextarea(ctx.element)) {
			ctx.element.style.visibility = '';
		}
		tinymce.init(finalInit);
	};
};


export default {
	props: {
		config: {
			type: Object,
			default: () => ({
				// 所有配置项请查看官方文档: https://www.tiny.cloud/docs/quick-start/
			})
		}
	},
	created: function () {
		const config = this.config
		this.elementId = config.id || uuid('tiny-vue');
		this.inlineMode = Boolean(config.inline)
	},
	watch: {
		disabled: function () {
			this.editor.setMode(this.disabled ? 'readonly' : 'design');
		}
	},
	mounted: function () {
		const config = this.config
		const defaultConfig = {

		}
		const finalConfig = Object.assign({}, defaultConfig, config)
		this.element = this.$el;
		tinymce.init(finalConfig)
	},
	beforeDestroy: function () {
		tinymce.remove(this.editor);
	},
	render: function (h) {
		const id = this.elementId
		const tagName = this.config.tagName
		return this.inlineMode ? renderInline(h, id, tagName) : renderIframe(h, id);
	}
};

{/* Button type="primary" stroke={true} extraClass="js-action" text={props.sharingText} attrs={{disabled: props.isOwnProfilePreview, 'data-action': props.ACTIONS.SHARE}} */}
<button className="button button--primary button--stroke js-action js-touchable qa-button" data-action={props.ACTIONS.SHARE} disabled={props.isOwnProfilePreview ? 'disabled' : undefined}>
    <div className="button__content">
        <span className="button__text js-button-text">{props.sharingText}</span>
    </div>
</button>

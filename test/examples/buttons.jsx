{/* <Button type="add-photo" text={buttonText} narrow="true" extraClass="js-action"/> */}
<button className="button button--add-photo button--narrow js-action js-action js-touchable qa-button">
    <div className="button__content">
        <span className="button__text js-button-text"></span>
    </div>
</button>

{/* <Button type={providerName} text={addPhotos} extraClass={
        js-add-photos
}
    /> */}
<button className="button js-action js-touchable qa-button">
    <div className="button__content">
        <span className="button__text js-button-text"></span>
    </div>
</button>

{/* <Button type="stroke" extraClass="js-navigation js-click-tracking"
    text={
        {nelly.get('gallery_import_title')}
    }
    attrs={
        data-action={NAVIGATION_ACTIONS.ADD_PHOTOS}
        data-tracking_element={ELEMENTS.UPLOAD_PHOTO_CTA}
        data-qa="add-photos"
}
    /> */}
<button className="button button--stroke js-navigation js-click-tracking js-action js-touchable qa-button">
    <div className="button__content">
        <span className="button__text js-button-text"></span>
    </div>
</button>

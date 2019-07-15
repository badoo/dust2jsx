<Button type="add-photo" text={buttonText} narrow="true" extraClass="js-action"/>

<Button type={providerName} text={addPhotos} extraClass="js-add-photos"
    />

<div>
    <Button type="stroke" extraClass="js-navigation js-click-tracking"
        text={nelly.get('gallery_import_title')}
        attrs={
            data-action={NAVIGATION_ACTIONS.ADD_PHOTOS}
            data-tracking_element={ELEMENTS.UPLOAD_PHOTO_CTA}
            data-qa="add-photos"
    }
        />
</div>

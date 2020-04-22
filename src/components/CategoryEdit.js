import React, {useContext, useEffect, useRef, useState} from 'react'
import {FirebaseContext} from '../context/firebase/firebaseContext'
import {useFormik} from 'formik'
import {messageToast} from '../utils/message.plugin'

export const CategoryEdit = ({validate, updateHandler, setLoading}) => {
  const ref = useRef()
  const refModal = useRef()
  const {categories, updateCategory, deleteCategory, deleteAllRecordsByCategoryId} = useContext(FirebaseContext)
  const [current, setCurrent] = useState(categories.length ? categories[categories.length - 1].id : null)

  const formik = useFormik({
    initialValues: {
      title: current ? (categories.find(item => item.id === current)).title : null,
      limit: current ? (categories.find(item => item.id === current)).limit : null
    },
    validate,
    onSubmit: values => editHandler(values, current),
    enableReinitialize: true
  })

  const editHandler = async (values, current) => {
    setLoading(true)
    await updateCategory(values, current)
    updateHandler()
    messageToast('Категория была обновлена')
    setLoading(false)
  }

  const deleteCategoryHandler = async (current) => {
    setLoading(true)
    await deleteCategory(current)
    updateHandler()
    messageToast('Категория была удалена')
    setLoading(false)
  }

  const deleteCategoryAndRecordsHandler = async (current) => {
    setLoading(true)
    await deleteCategory(current)
    await deleteAllRecordsByCategoryId(current)
    messageToast('Категория и связанные записи были удалены')
    setLoading(false)
  }

  useEffect(() => {
    const formInit = window.M.FormSelect.init(ref.current)

    return () => {
      if (formInit && formInit.destroy) {
        formInit.destroy()
      }

    }
  })

  useEffect(() => {
    const modalInit = window.M.Modal.init(refModal.current)

    return () => {
      if (modalInit && modalInit.destroy) {
        modalInit.destroy()
      }
    }
  })

  return (
    <div className="col s12 m6">
      <div>
      {
        current
          ?
          <>
            <div className="page-subtitle">
              <h4>Редактировать</h4>
            </div>
            <form onSubmit={formik.handleSubmit} noValidate >
              <div className="input-field">
                <select
                  ref={ref}
                  id='current'
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                >
                  {categories.map(cat => <option value={cat.id} key={cat.id}>{cat.title}</option>)}

                </select>
                <label>Выберите категорию</label>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  id="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.errors.title && formik.touched.title ? 'invalid' : null}
                />
                <label htmlFor="name">Название</label>
                {formik.errors.title && formik.touched.title ? <span className="helper-text invalid">{formik.errors.title}</span> : null}
              </div>

              <div className="input-field">
                <input
                  id="limit"
                  type="number"
                  value={formik.values.limit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.errors.limit && formik.touched.limit ? 'invalid' : null}

                />
                <label htmlFor="limit">Лимит</label>
                {formik.errors.limit && formik.touched.limit ? <span className="helper-text invalid">{formik.errors.limit}</span> : null}
              </div>

              <button className="btn waves-effect waves-light" type="submit">
                Обновить
                <i className="material-icons right">send</i>
              </button>
              <button style={{marginLeft: 20}} data-target="modal1" className="btn modal-trigger waves-effect waves-light">
                  Удалить
                <i className="material-icons right">delete</i>
              </button>

              <div ref={refModal} id="modal1" className="modal">
                <div className="modal-content">
                  {/*<h4>Modal Header</h4>*/}
                  <h5>Вы хотите удалить связанные с категорией записи?</h5>
                </div>
                <div className="modal-footer">
                  <a href="#!"
                     className="modal-close waves-effect waves-green btn"
                     style={{marginRight: 20}}
                     onClick={(e) => {
                       e.preventDefault()
                       deleteCategoryAndRecordsHandler(current)
                     }}
                  >
                    Да
                  </a>
                  <a href="#!"
                     className="modal-close waves-effect waves-red btn"
                     onClick={(e) => {
                       e.preventDefault()
                       deleteCategoryHandler(current)
                     }}
                  >
                    Нет
                  </a>
                  <a href="#!" className="modal-close waves-effect waves-gray btn-flat">Отмена</a>
                </div>
              </div>

            </form>
          </>
          :
          <h5 style={{textAlign: 'center'}}>Категорий пока нет</h5>
        }
      </div>
    </div>
  )
}
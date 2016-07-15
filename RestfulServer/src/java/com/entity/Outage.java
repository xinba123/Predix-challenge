/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author Jie Zhang
 */
@Entity
@Table(name = "OUTAGE")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Outage.findAll", query = "SELECT o FROM Outage o"),
    @NamedQuery(name = "Outage.findByOutid", query = "SELECT o FROM Outage o WHERE o.outid = :outid"),
    @NamedQuery(name = "Outage.findByOuttype", query = "SELECT o FROM Outage o WHERE o.outtype = :outtype"),
    @NamedQuery(name = "Outage.findByOutcat", query = "SELECT o FROM Outage o WHERE o.outcat = :outcat"),
    @NamedQuery(name = "Outage.findByOutinterdate", query = "SELECT o FROM Outage o WHERE o.outinterdate = :outinterdate"),
    @NamedQuery(name = "Outage.findByOutfirstres", query = "SELECT o FROM Outage o WHERE o.outfirstres = :outfirstres"),
    @NamedQuery(name = "Outage.findByOutfinalres", query = "SELECT o FROM Outage o WHERE o.outfinalres = :outfinalres")})
public class Outage implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "OUTID")
    private Integer outid;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "OUTTYPE")
    private String outtype;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "OUTCAT")
    private String outcat;
    @Basic(optional = false)
    @NotNull
    @Column(name = "OUTINTERDATE")
    @Temporal(TemporalType.DATE)
    private Date outinterdate;
    @Basic(optional = false)
    @NotNull
    @Column(name = "OUTFIRSTRES")
    @Temporal(TemporalType.DATE)
    private Date outfirstres;
    @Basic(optional = false)
    @NotNull
    @Column(name = "OUTFINALRES")
    @Temporal(TemporalType.DATE)
    private Date outfinalres;
    @JoinColumn(name = "SUBSID", referencedColumnName = "SUBSID")
    @ManyToOne(optional = false)
    private Substation subsid;

    public Outage() {
    }

    public Outage(Integer outid) {
        this.outid = outid;
    }

    public Outage(Integer outid, String outtype, String outcat, Date outinterdate, Date outfirstres, Date outfinalres) {
        this.outid = outid;
        this.outtype = outtype;
        this.outcat = outcat;
        this.outinterdate = outinterdate;
        this.outfirstres = outfirstres;
        this.outfinalres = outfinalres;
    }

    public Integer getOutid() {
        return outid;
    }

    public void setOutid(Integer outid) {
        this.outid = outid;
    }

    public String getOuttype() {
        return outtype;
    }

    public void setOuttype(String outtype) {
        this.outtype = outtype;
    }

    public String getOutcat() {
        return outcat;
    }

    public void setOutcat(String outcat) {
        this.outcat = outcat;
    }

    public Date getOutinterdate() {
        return outinterdate;
    }

    public void setOutinterdate(Date outinterdate) {
        this.outinterdate = outinterdate;
    }

    public Date getOutfirstres() {
        return outfirstres;
    }

    public void setOutfirstres(Date outfirstres) {
        this.outfirstres = outfirstres;
    }

    public Date getOutfinalres() {
        return outfinalres;
    }

    public void setOutfinalres(Date outfinalres) {
        this.outfinalres = outfinalres;
    }

    public Substation getSubsid() {
        return subsid;
    }

    public void setSubsid(Substation subsid) {
        this.subsid = subsid;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (outid != null ? outid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Outage)) {
            return false;
        }
        Outage other = (Outage) object;
        if ((this.outid == null && other.outid != null) || (this.outid != null && !this.outid.equals(other.outid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.entity.Outage[ outid=" + outid + " ]";
    }
    
}
